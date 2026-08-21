const db = require('../config/db');
const { getDisasterNews } = require('../services/gnewsService');

// Helper format relative time
function formatRelativeTime(date) {
  if (!date) return 'Baru saja';
  const now = new Date();
  const diffMs = now - new Date(date);
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 1) return 'Baru saja';
  if (diffMinutes < 60) return `${diffMinutes} mnt lalu`;
  if (diffHours < 24) return `${diffHours} jam lalu`;
  if (diffDays === 1) return 'Kemarin';
  if (diffDays < 7) return `${diffDays} hari lalu`;
  return new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
}

class NotificationModel {
  /**
   * Mengambil notifikasi terpadu (Peringatan Admin, Laporan Tervalidasi, Berita Eksternal, Edukasi Baru, dan Tabel Notifications)
   * @param {object} param0 
   * @returns {Promise<Array>}
   */
  static async getUnifiedNotifications({ limit = 35 } = {}) {
    const allItems = [];
    const seenKeys = new Set();

    // 1. Ambil Peringatan Darurat dari Tabel alerts
    try {
      const [alerts] = await db.query(
        `SELECT a.*, u.name AS author_name 
         FROM alerts a 
         LEFT JOIN users u ON a.created_by = u.id
         WHERE a.status = 'terkirim'
         ORDER BY a.sent_at DESC 
         LIMIT 10`
      );

      alerts.forEach((a) => {
        const targetStr =
          typeof a.target_areas === 'string'
            ? JSON.parse(a.target_areas).join(', ')
            : Array.isArray(a.target_areas)
            ? a.target_areas.join(', ')
            : 'Semua Wilayah';

        const isBahaya = a.level === 'bahaya';
        const isPeringatan = a.level === 'peringatan';
        const key = `alert-${a.id}`;

        seenKeys.add(key);
        allItems.push({
          id: key,
          rawId: a.id,
          category: 'Peringatan',
          type: isBahaya ? 'PERINGATAN BAHAYA' : isPeringatan ? 'PERINGATAN SIAGA' : 'PESAN ADMIN',
          level: a.level,
          title: `🚨 Peringatan ${a.level.toUpperCase()}: ${targetStr}`,
          desc: a.message,
          time: formatRelativeTime(a.sent_at),
          timestamp: new Date(a.sent_at).getTime(),
          iconType: isBahaya ? 'Zap' : isPeringatan ? 'AlertTriangle' : 'Info',
          iconBg: isBahaya ? 'bg-red-100 text-brand-red' : isPeringatan ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700',
          link: '/dashboard'
        });
      });
    } catch (err) {
      console.warn('Get alerts for notifications err:', err.message);
    }

    // 2. Ambil Laporan Insiden Warga yang telah Divalidasi dari Tabel incident_reports
    try {
      const [reports] = await db.query(
        `SELECT r.*, u.name AS reporter_name
         FROM incident_reports r
         LEFT JOIN users u ON r.user_id = u.id
         WHERE r.status = 'divalidasi'
         ORDER BY r.validated_at DESC, r.created_at DESC
         LIMIT 10`
      );

      reports.forEach((r) => {
        const disasterLabel = (r.disaster_type || 'BENCANA').replace('_', ' ').toUpperCase();
        const key = `report-${r.id}`;

        seenKeys.add(key);
        allItems.push({
          id: key,
          rawId: r.id,
          category: 'Laporan',
          type: 'LAPORAN TERVERIFIKASI',
          level: 'peringatan',
          title: `🛡️ Laporan Terverifikasi: ${disasterLabel} di ${r.location_text}`,
          desc: r.description || `Laporan insiden ${r.disaster_type} di ${r.location_text} telah diverifikasi tim admin.`,
          time: formatRelativeTime(r.validated_at || r.created_at),
          timestamp: new Date(r.validated_at || r.created_at).getTime(),
          iconType: 'ShieldAlert',
          iconBg: 'bg-red-100 text-brand-red',
          link: '/dashboard'
        });
      });
    } catch (err) {
      console.warn('Get reports for notifications err:', err.message);
    }

    // 3. Ambil Materi Edukasi & Tips yang Didistribusikan dari Tabel content
    try {
      const [contents] = await db.query(
        `SELECT c.* 
         FROM content c
         WHERE c.status = 'distribusikan'
         ORDER BY c.updated_at DESC, c.created_at DESC
         LIMIT 10`
      );

      contents.forEach((c) => {
        const isVideo = c.type === 'video';
        const key = `content-${c.id}`;

        seenKeys.add(key);
        allItems.push({
          id: key,
          rawId: c.id,
          category: 'Edukasi',
          type: isVideo ? 'VIDEO TUTORIAL BARU' : 'PANDUAN EDUKASI BARU',
          level: 'info',
          title: `${isVideo ? '🎬 Video' : '📚 Panduan'}: ${c.title}`,
          desc: c.body ? c.body.replace(/[#*`_]/g, '').slice(0, 130) + '...' : 'Materi edukasi dan tips mitigasi keselamatan baru.',
          time: formatRelativeTime(c.updated_at || c.created_at),
          timestamp: new Date(c.updated_at || c.created_at).getTime(),
          iconType: 'GraduationCap',
          iconBg: 'bg-sky-100 text-sky-700',
          link: isVideo ? '/edukasi/video' : `/edukasi/${c.slug}`
        });
      });
    } catch (err) {
      console.warn('Get contents for notifications err:', err.message);
    }

    // 4. Ambil Berita Eksternal Terkini (GNews API)
    try {
      const newsArticles = await getDisasterNews();
      if (Array.isArray(newsArticles)) {
        const topNews = newsArticles.slice(0, 8);
        topNews.forEach((n, idx) => {
          const key = `news-${n.id || idx}`;
          seenKeys.add(key);
          allItems.push({
            id: key,
            rawId: n.id || idx,
            category: 'Berita',
            type: 'BERITA TERBARU',
            level: 'info',
            title: `📰 ${n.title}`,
            desc: n.excerpt || n.description || `Kabar terkini mitigasi kebencanaan dari ${n.source?.name || 'media nasional'}.`,
            time: formatRelativeTime(n.publishedAt || n.date),
            timestamp: new Date(n.publishedAt || n.date || Date.now()).getTime(),
            iconType: 'Newspaper',
            iconBg: 'bg-blue-100 text-blue-700',
            link: `/berita/${n.id}`
          });
        });
      }
    } catch (err) {
      console.warn('Get news for notifications err:', err.message);
    }

    // 5. Ambil data dari tabel notifications untuk pesan kustom lainnya
    try {
      const [customNotifs] = await db.query(
        `SELECT * FROM notifications ORDER BY created_at DESC LIMIT 20`
      );

      customNotifs.forEach((r) => {
        const key = `db-notif-${r.id}`;
        // Jangan duplikasi jika sudah tercover
        if (r.reference_id && (seenKeys.has(`alert-${r.reference_id}`) || seenKeys.has(`report-${r.reference_id}`) || seenKeys.has(`content-${r.reference_id}`))) {
          return;
        }

        let category = 'Peringatan';
        let iconType = 'AlertTriangle';
        let iconBg = 'bg-red-100 text-brand-red';
        let link = '/dashboard';

        const typeUpper = (r.type || '').toUpperCase();
        if (typeUpper.includes('LAPORAN')) {
          category = 'Laporan';
          iconType = 'ShieldAlert';
          iconBg = 'bg-red-100 text-brand-red';
          link = '/dashboard';
        } else if (typeUpper.includes('BERITA')) {
          category = 'Berita';
          iconType = 'Newspaper';
          iconBg = 'bg-blue-100 text-blue-700';
          link = r.reference_id ? `/berita/${r.reference_id}` : '/berita';
        } else if (typeUpper.includes('EDUKASI')) {
          category = 'Edukasi';
          iconType = 'GraduationCap';
          iconBg = 'bg-sky-100 text-sky-700';
          link = '/edukasi';
        } else if (typeUpper.includes('PESAN_ADMIN')) {
          category = 'Peringatan';
          iconType = 'Info';
          iconBg = 'bg-indigo-100 text-indigo-700';
          link = '/dashboard';
        }

        allItems.push({
          id: key,
          rawId: r.id,
          category,
          type: r.type,
          title: r.title,
          desc: r.message,
          time: formatRelativeTime(r.created_at),
          timestamp: new Date(r.created_at).getTime(),
          iconType,
          iconBg,
          link
        });
      });
    } catch (err) {
      console.warn('Get custom notifications err:', err.message);
    }

    // Urutkan seluruh notifikasi dari yang paling baru
    allItems.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

    return allItems.slice(0, limit);
  }

  /**
   * Menambahkan notifikasi baru ke database
   */
  static async createNotification({ user_id = null, type, title, message, reference_id = null }) {
    const [result] = await db.query(
      `INSERT INTO notifications (user_id, type, title, message, reference_id, is_read, created_at)
       VALUES (?, ?, ?, ?, ?, 0, NOW())`,
      [user_id, type, title, message, reference_id]
    );
    return result.insertId;
  }
}

module.exports = NotificationModel;
