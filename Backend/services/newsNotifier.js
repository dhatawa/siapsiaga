const cron = require('node-cron');
const db = require('../config/db');
const { getDisasterNews } = require('./gnewsService');
const { isMailConfigured, sendNewsDigestEmail } = require('./mailService');

const INTERVAL_MINUTES = Number(process.env.NEWS_EMAIL_INTERVAL_MINUTES ?? 30);

// Gmail membatasi jumlah penerima per email, jadi dikirim per kelompok BCC
const BCC_BATCH_SIZE = 50;

let running = false;

async function ensureTable() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS news_email_log (
      news_id VARCHAR(64) PRIMARY KEY,
      title VARCHAR(500) NOT NULL,
      url VARCHAR(1000) NULL,
      sent_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

async function markAsSent(articles) {
  if (articles.length === 0) return;

  await db.query(
    'INSERT IGNORE INTO news_email_log (news_id, title, url, sent_at) VALUES ?',
    [articles.map((a) => [a.id, a.title.slice(0, 500), a.url, new Date()])]
  );
}

async function getActiveUserEmails() {
  const [rows] = await db.query(
    "SELECT email FROM users WHERE status = 'aktif' AND email IS NOT NULL"
  );
  return rows.map((r) => r.email);
}

/**
 * Cek berita terbaru dan kirim email ke seluruh pengguna aktif bila ada berita baru
 */
async function checkAndNotify() {
  if (running) return;
  running = true;

  try {
    const news = await getDisasterNews();
    if (!Array.isArray(news) || news.length === 0) return;

    const [[{ total }]] = await db.query('SELECT COUNT(*) AS total FROM news_email_log');

    // Jalankan pertama kali: tandai berita yang sudah ada tanpa mengirim email,
    // supaya pengguna tidak menerima banjir email berita lama
    if (Number(total) === 0) {
      await markAsSent(news);
      console.log(`  Notifikasi berita: ${news.length} berita awal ditandai (tanpa email).`);
      return;
    }

    const [sentRows] = await db.query(
      'SELECT news_id FROM news_email_log WHERE news_id IN (?)',
      [news.map((n) => n.id)]
    );
    const sentIds = new Set(sentRows.map((r) => r.news_id));
    const newArticles = news.filter((n) => !sentIds.has(n.id));

    if (newArticles.length === 0) return;

    const emails = await getActiveUserEmails();

    for (let i = 0; i < emails.length; i += BCC_BATCH_SIZE) {
      await sendNewsDigestEmail({
        bcc: emails.slice(i, i + BCC_BATCH_SIZE),
        articles: newArticles
      });
    }

    await markAsSent(newArticles);

    console.log(
      `  Notifikasi berita: ${newArticles.length} berita baru dikirim ke ${emails.length} pengguna.`
    );
  } catch (error) {
    console.error('NEWS NOTIFIER ERROR:', error.message);
  } finally {
    running = false;
  }
}

function startNewsNotifier() {
  if (!INTERVAL_MINUTES || INTERVAL_MINUTES <= 0) {
    console.log('  Notifikasi email berita dimatikan (NEWS_EMAIL_INTERVAL_MINUTES=0).');
    return;
  }

  if (!isMailConfigured()) {
    console.warn('  Notifikasi email berita tidak aktif: EMAIL_USER / EMAIL_PASS belum diatur.');
    return;
  }

  const minutes = Math.min(59, Math.max(1, Math.floor(INTERVAL_MINUTES)));

  ensureTable()
    .then(() => {
      checkAndNotify();
      cron.schedule(`*/${minutes} * * * *`, checkAndNotify);
      console.log(`  Notifikasi email berita aktif (cek setiap ${minutes} menit).`);
    })
    .catch((error) => {
      console.error('NEWS NOTIFIER INIT ERROR:', error.message);
    });
}

module.exports = {
  startNewsNotifier,
  checkAndNotify
};
