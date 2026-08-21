const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { verifyToken, verifyRole } = require('../middleware/authMiddleware');
const { uploadReportPhoto } = require('../middleware/uploadMiddleware');

// ===================================
// RUTE PUBLIK & PENGGUNA
// ===================================

// Ambil laporan yang telah divalidasi (untuk feed / dashboard publik)
router.get('/public', reportController.getPublicValidatedReports);

// Buat laporan insiden baru (Pengguna wajib login / terverifikasi token)
router.post('/', verifyToken, uploadReportPhoto.single('photo'), reportController.createReport);

// Ambil riwayat laporan milik user yang login
router.get('/my', verifyToken, reportController.getMyReports);

// ===================================
// RUTE ADMIN (Khusus Role Admin)
// ===================================

// Ambil semua laporan dengan filter & counter stats
router.get('/admin/all', verifyToken, verifyRole('admin'), reportController.getAllAdminReports);

// Ambil detail satu laporan berdasarkan ID
router.get('/:id', verifyToken, reportController.getReportById);

// Validasi / Approve / Reject laporan
router.patch('/:id/validate', verifyToken, verifyRole('admin'), reportController.validateReport);

// Hapus laporan
router.delete('/:id', verifyToken, verifyRole('admin'), reportController.deleteReport);

module.exports = router;
