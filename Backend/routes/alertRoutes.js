const express = require('express');
const router = express.Router();
const alertController = require('../controllers/alertController');
const { verifyToken, verifyRole } = require('../middleware/authMiddleware');

// Ambil siaran peringatan aktif terbaru (Pengguna / Publik)
router.get('/recent', alertController.getRecentAlerts);

// ===================================
// RUTE ADMIN
// ===================================

// Ambil semua riwayat pengiriman siaran peringatan
router.get('/', verifyToken, verifyRole('admin'), alertController.getAllAlerts);

// Kirim siaran peringatan darurat baru
router.post('/', verifyToken, verifyRole('admin'), alertController.createAlert);

// Hapus siaran peringatan
router.delete('/:id', verifyToken, verifyRole('admin'), alertController.deleteAlert);

module.exports = router;
