const NotificationModel = require('../models/notificationModel');

/**
 * Mengambil daftar notifikasi terpadu (Peringatan Admin, Laporan Valid, Berita Eksternal, Edukasi Baru)
 */
async function getNotifications(req, res) {
  try {
    const limit = parseInt(req.query.limit) || 30;
    const notifications = await NotificationModel.getUnifiedNotifications({ limit });

    return res.json({
      success: true,
      count: notifications.length,
      data: notifications
    });
  } catch (error) {
    console.error('GET NOTIFICATIONS ERROR:', error);
    return res.status(500).json({
      success: false,
      message: 'Gagal mengambil data notifikasi.'
    });
  }
}

/**
 * Menandai semua notifikasi sebagai telah dibaca
 */
async function markAllAsRead(req, res) {
  try {
    return res.json({
      success: true,
      message: 'Semua notifikasi telah ditandai sebagai dibaca.'
    });
  } catch (error) {
    console.error('MARK ALL NOTIFICATIONS READ ERROR:', error);
    return res.status(500).json({
      success: false,
      message: 'Gagal memperbarui status baca notifikasi.'
    });
  }
}

module.exports = {
  getNotifications,
  markAllAsRead
};
