const nodemailer = require('nodemailer');

const EMAIL_USER = (process.env.EMAIL_USER || '').trim();
const EMAIL_PASS = (process.env.EMAIL_PASS || '').replace(/\s/g, '');
const FROM_NAME = process.env.EMAIL_FROM_NAME || 'Siap Siaga';
const FRONTEND_URL = (process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/$/, '');

// Gmail membutuhkan App Password (bukan password akun biasa)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS
  }
});

function isMailConfigured() {
  return Boolean(EMAIL_USER && EMAIL_PASS);
}

function escapeHtml(text = '') {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Kerangka email bersama, warna mengikuti brand merah Siap Siaga (#C81E2C)
function layout(title, innerHtml) {
  return `
  <div style="background:#f3f4f6;padding:24px 12px;font-family:Inter,Arial,sans-serif;">
    <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
      <div style="background:#C81E2C;color:#ffffff;padding:18px 24px;">
        <p style="margin:0;font-size:18px;font-weight:700;">Siap Siaga</p>
        <p style="margin:4px 0 0;font-size:12px;opacity:.9;">${escapeHtml(title)}</p>
      </div>
      <div style="padding:24px;color:#374151;font-size:14px;line-height:1.6;">
        ${innerHtml}
      </div>
      <div style="padding:14px 24px;background:#f9fafb;color:#9ca3af;font-size:11px;border-top:1px solid #f3f4f6;">
        Email ini dikirim otomatis oleh sistem Siap Siaga. Mohon tidak membalas email ini.
      </div>
    </div>
  </div>`;
}

async function sendMail({ to, bcc, subject, html }) {
  if (!isMailConfigured()) {
    throw new Error('EMAIL_USER / EMAIL_PASS belum diatur di file .env');
  }

  return transporter.sendMail({
    from: `"${FROM_NAME}" <${EMAIL_USER}>`,
    to,
    bcc,
    subject,
    html
  });
}

const OTP_PURPOSE_TEXT = {
  register: 'menyelesaikan pendaftaran akun',
  reset_password: 'mengatur ulang kata sandi'
};

async function sendOtpEmail({ to, name, code, purpose, expiresMinutes }) {
  const action = OTP_PURPOSE_TEXT[purpose] || 'verifikasi akun';

  const html = layout('Kode Verifikasi (OTP)', `
    <p style="margin:0 0 12px;">Halo <strong>${escapeHtml(name || 'Pengguna')}</strong>,</p>
    <p style="margin:0 0 16px;">Gunakan kode berikut untuk ${action}:</p>
    <div style="text-align:center;margin:20px 0;">
      <span style="display:inline-block;font-size:30px;font-weight:800;letter-spacing:10px;color:#C81E2C;background:#FEF2F2;border:1px solid #FECACA;border-radius:10px;padding:12px 20px;">${escapeHtml(code)}</span>
    </div>
    <p style="margin:0 0 8px;">Kode berlaku selama <strong>${expiresMinutes} menit</strong>.</p>
    <p style="margin:0;color:#6b7280;font-size:12px;">Jangan berikan kode ini kepada siapa pun. Jika Anda tidak merasa meminta kode ini, abaikan email ini.</p>
  `);

  return sendMail({
    to,
    subject: `${code} adalah kode OTP Siap Siaga Anda`,
    html
  });
}

async function sendNewsDigestEmail({ bcc, articles }) {
  const items = articles
    .map((a) => {
      const link = `${FRONTEND_URL}/berita/${encodeURIComponent(a.id)}`;
      return `
      <tr><td style="padding:14px 0;border-bottom:1px solid #f3f4f6;">
        ${a.image ? `<img src="${escapeHtml(a.image)}" alt="" style="width:100%;max-height:200px;object-fit:cover;border-radius:8px;margin-bottom:10px;" />` : ''}
        <span style="display:inline-block;font-size:10px;font-weight:600;color:#ffffff;background:#C81E2C;border-radius:4px;padding:2px 8px;">${escapeHtml(a.category)}</span>
        <span style="font-size:11px;color:#9ca3af;margin-left:6px;">${escapeHtml(a.date)} · ${escapeHtml(a.source)}</span>
        <p style="margin:8px 0 4px;font-size:15px;font-weight:700;color:#111827;line-height:1.4;">${escapeHtml(a.title)}</p>
        <p style="margin:0 0 8px;font-size:13px;color:#6b7280;">${escapeHtml(a.excerpt).slice(0, 220)}</p>
        <a href="${link}" style="font-size:13px;font-weight:600;color:#C81E2C;text-decoration:none;">Baca selengkapnya →</a>
      </td></tr>`;
    })
    .join('');

  const html = layout('Berita Kebencanaan Terbaru', `
    <p style="margin:0 0 8px;">Ada <strong>${articles.length} berita baru</strong> terkait kebencanaan yang perlu Anda ketahui:</p>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">${items}</table>
    <div style="text-align:center;margin-top:20px;">
      <a href="${FRONTEND_URL}/berita" style="display:inline-block;background:#C81E2C;color:#ffffff;text-decoration:none;font-weight:600;font-size:13px;padding:10px 18px;border-radius:8px;">Lihat Semua Berita</a>
    </div>
  `);

  const subject = articles.length === 1
    ? `📰 Berita Baru: ${articles[0].title}`
    : `📰 ${articles.length} Berita Kebencanaan Terbaru`;

  return sendMail({
    to: EMAIL_USER,
    bcc,
    subject,
    html
  });
}

module.exports = {
  isMailConfigured,
  sendOtpEmail,
  sendNewsDigestEmail
};
