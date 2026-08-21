const ReportModel = require('../models/reportModel');
const db = require('../config/db');
const path = require('path');
const fs = require('fs');

/**
 * Helper untuk menghapus file foto laporan lama
 */
function removeLocalFile(fileUrl) {
  if (!fileUrl) return;
  try {
    const urlParts = fileUrl.split('/uploads/');
    if (urlParts.length > 1) {
      const relativePath = urlParts[1];
      const fullPath = path.join(__dirname, '../uploads', relativePath);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    }
  } catch (err) {
    console.error('Gagal menghapus file foto:', err.message);
  }
}

/**
 * Membuat laporan insiden baru dari pengguna
 */
async function createReport(req, res) {
  try {
    const { disaster_type, location_text, latitude, longitude, description } = req.body;

    if (!disaster_type) {
      return res.status(400).json({
        success: false,
        message: 'Jenis bencana wajib dipilih.'
      });
    }

    if (!location_text || !location_text.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Nama lokasi atau patokan kejadian wajib diisi.'
      });
    }

    let photoUrl = null;
    if (req.file) {
      const host = req.get('host');
      const protocol = req.protocol;
      photoUrl = `${protocol}://${host}/uploads/reports/${req.file.filename}`;
    }

    const userId = req.user ? req.user.id : null;

    const newReport = await ReportModel.createReport({
      user_id: userId,
      disaster_type,
      location_text: location_text.trim(),
      latitude: latitude || null,
      longitude: longitude || null,
      description: description ? description.trim() : null,
      photo_url: photoUrl,
      status: 'menunggu'
    });

    return res.status(201).json({
      success: true,
      message: 'Laporan insiden Anda berhasil dikirim dan sedang menunggu validasi oleh tim Siap Siaga.',
      data: newReport
    });
  } catch (error) {
    console.error('CREATE REPORT ERROR:', error);
    return res.status(500).json({
      success: false,
      message: 'Gagal mengirim laporan bencana: ' + (error.message || 'Kesalahan server')
    });
  }
}

/**
 * Mengambil semua laporan untuk Admin (dengan filter & counter)
 */
async function getAllAdminReports(req, res) {
  try {
    const { status, disaster_type, search } = req.query;
    const reports = await ReportModel.getAllReports({ status, disaster_type, search });
    const stats = await ReportModel.getStats();

    return res.json({
      success: true,
      count: reports.length,
      data: reports,
      stats: stats
    });
  } catch (error) {
    console.error('GET ALL ADMIN REPORTS ERROR:', error);
    return res.status(500).json({
      success: false,
      message: 'Gagal mengambil data laporan insiden.'
    });
  }
}

/**
 * Mengambil daftar laporan terverifikasi untuk publik
 */
async function getPublicValidatedReports(req, res) {
  try {
    const { disaster_type, search } = req.query;
    const reports = await ReportModel.getValidatedReports({ disaster_type, search });

    return res.json({
      success: true,
      count: reports.length,
      data: reports
    });
  } catch (error) {
    console.error('GET PUBLIC REPORTS ERROR:', error);
    return res.status(500).json({
      success: false,
      message: 'Gagal mengambil data laporan terverifikasi.'
    });
  }
}

/**
 * Mengambil riwayat laporan pengguna yang sedang login
 */
async function getMyReports(req, res) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Pengguna tidak terautentikasi.'
      });
    }

    const reports = await ReportModel.getUserReports(req.user.id);

    return res.json({
      success: true,
      count: reports.length,
      data: reports
    });
  } catch (error) {
    console.error('GET MY REPORTS ERROR:', error);
    return res.status(500).json({
      success: false,
      message: 'Gagal mengambil riwayat laporan Anda.'
    });
  }
}

/**
 * Mengambil detail laporan berdasarkan ID
 */
async function getReportById(req, res) {
  try {
    const { id } = req.params;
    const report = await ReportModel.findById(id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Laporan tidak ditemukan.'
      });
    }

    return res.json({
      success: true,
      data: report
    });
  } catch (error) {
    console.error('GET REPORT BY ID ERROR:', error);
    return res.status(500).json({
      success: false,
      message: 'Gagal mengambil detail laporan.'
    });
  }
}

/**
 * Validasi / Approve / Tolak laporan oleh Admin
 */
async function validateReport(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['divalidasi', 'ditolak', 'menunggu'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status tidak valid. Gunakan 'divalidasi', 'ditolak', atau 'menunggu'."
      });
    }

    const existing = await ReportModel.findById(id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Laporan tidak ditemukan.'
      });
    }

    const adminId = req.user ? req.user.id : null;

    const updated = await ReportModel.updateReportStatus(id, {
      status,
      validated_by: adminId
    });

    // Jika disetujui/divalidasi, buat notifikasi untuk seluruh pengguna
    if (status === 'divalidasi') {
      try {
        const disasterLabel = existing.disaster_type.replace('_', ' ').toUpperCase();
        await db.query(
          `INSERT INTO notifications (user_id, type, title, message, reference_id, is_read, created_at)
           VALUES (NULL, 'LAPORAN_BENCANA', ?, ?, ?, 0, NOW())`,
          [
            `🛡️ Laporan Terverifikasi: ${disasterLabel} di ${existing.location_text}`,
            existing.description || `Laporan insiden ${existing.disaster_type} di ${existing.location_text} telah diverifikasi tim admin.`,
            existing.id
          ]
        );
      } catch (notifErr) {
        console.warn('Sync report validation to notifications error:', notifErr.message);
      }
    }

    const statusLabel =
      status === 'divalidasi' ? 'divalidasi dan dipublikasikan' : status === 'ditolak' ? 'ditolak' : 'dikembalikan ke antrian';

    return res.json({
      success: true,
      message: `Laporan #${id} berhasil ${statusLabel}.`,
      data: updated
    });
  } catch (error) {
    console.error('VALIDATE REPORT ERROR:', error);
    return res.status(500).json({
      success: false,
      message: 'Gagal memperbarui status validasi laporan.'
    });
  }
}

/**
 * Menghapus laporan (Admin)
 */
async function deleteReport(req, res) {
  try {
    const { id } = req.params;
    const existing = await ReportModel.findById(id);

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Laporan tidak ditemukan.'
      });
    }

    // Hapus file foto dari server jika ada
    removeLocalFile(existing.photo_url);

    await ReportModel.deleteReport(id);

    return res.json({
      success: true,
      message: 'Laporan berhasil dihapus.'
    });
  } catch (error) {
    console.error('DELETE REPORT ERROR:', error);
    return res.status(500).json({
      success: false,
      message: 'Gagal menghapus data laporan.'
    });
  }
}

module.exports = {
  createReport,
  getAllAdminReports,
  getPublicValidatedReports,
  getMyReports,
  getReportById,
  validateReport,
  deleteReport
};
