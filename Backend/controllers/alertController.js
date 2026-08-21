const AlertModel = require('../models/alertModel');
const db = require('../config/db');

/**
 * Membuat dan mengirimkan siaran peringatan darurat baru (Admin)
 */
async function createAlert(req, res) {
  try {
    const { level, message, target_areas } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Pesan peringatan darurat wajib diisi.'
      });
    }

    if (message.length > 160) {
      return res.status(400).json({
        success: false,
        message: 'Pesan peringatan maksimal 160 karakter.'
      });
    }

    const createdBy = req.user ? req.user.id : 1;
    const areas = target_areas && target_areas.length > 0 ? target_areas : ['Semua Wilayah'];

    const newAlert = await AlertModel.createAlert({
      created_by: createdBy,
      level: level || 'bahaya',
      message: message.trim(),
      target_areas: areas,
      status: 'terkirim'
    });

    // Catat juga ke tabel notifications agar tersinkronisasi
    try {
      const levelTitle =
        level === 'bahaya'
          ? '🚨 PERINGATAN BAHAYA'
          : level === 'peringatan'
          ? '⚠️ PERINGATAN SIAGA'
          : 'ℹ️ INFORMASI KESELAMATAN';

      await db.query(
        `INSERT INTO notifications (user_id, type, title, message, reference_id, is_read, created_at)
         VALUES (NULL, 'PERINGATAN_DARURAT', ?, ?, ?, 0, NOW())`,
        [
          `${levelTitle}: ${areas.join(', ')}`,
          message.trim(),
          newAlert.id
        ]
      );
    } catch (notifErr) {
      console.warn('Notification sync log error:', notifErr.message);
    }

    return res.status(201).json({
      success: true,
      message: `Siaran peringatan tingkat [${(level || 'bahaya').toUpperCase()}] berhasil dikirim ke wilayah target.`,
      data: newAlert
    });
  } catch (error) {
    console.error('CREATE ALERT ERROR:', error);
    return res.status(500).json({
      success: false,
      message: 'Gagal mengirimkan siaran peringatan darurat.'
    });
  }
}

/**
 * Mengambil semua riwayat siaran peringatan (Admin)
 */
async function getAllAlerts(req, res) {
  try {
    const alerts = await AlertModel.getAllAlerts();
    return res.json({
      success: true,
      count: alerts.length,
      data: alerts
    });
  } catch (error) {
    console.error('GET ALL ALERTS ERROR:', error);
    return res.status(500).json({
      success: false,
      message: 'Gagal mengambil riwayat pengiriman peringatan.'
    });
  }
}

/**
 * Mengambil siaran peringatan aktif terbaru (Pengguna / Publik)
 */
async function getRecentAlerts(req, res) {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const alerts = await AlertModel.getRecentAlerts(limit);
    return res.json({
      success: true,
      count: alerts.length,
      data: alerts
    });
  } catch (error) {
    console.error('GET RECENT ALERTS ERROR:', error);
    return res.status(500).json({
      success: false,
      message: 'Gagal mengambil data peringatan terbaru.'
    });
  }
}

/**
 * Menghapus siaran peringatan (Admin)
 */
async function deleteAlert(req, res) {
  try {
    const { id } = req.params;
    const existing = await AlertModel.findById(id);

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Peringatan tidak ditemukan.'
      });
    }

    await AlertModel.deleteAlert(id);

    return res.json({
      success: true,
      message: 'Siaran peringatan berhasil dihapus.'
    });
  } catch (error) {
    console.error('DELETE ALERT ERROR:', error);
    return res.status(500).json({
      success: false,
      message: 'Gagal menghapus siaran peringatan.'
    });
  }
}

module.exports = {
  createAlert,
  getAllAlerts,
  getRecentAlerts,
  deleteAlert
};
