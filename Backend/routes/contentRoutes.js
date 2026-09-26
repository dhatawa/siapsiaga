const express = require('express');
const router = express.Router();
const contentController = require('../controllers/contentController');
const { verifyToken, verifyRole } = require('../middleware/authMiddleware');
const { uploadContentMedia } = require('../middleware/uploadMiddleware');

// ===================================
// RUTE PUBLIK (Untuk Pengguna & Pengunjung)
// ===================================

// Ambil daftar konten berstatus 'distribusikan'
router.get('/', contentController.getPublicContents);

// Ambil detail konten berdasarkan slug
router.get('/slug/:slug', contentController.getContentBySlug);

// ===================================
// RUTE ADMIN (Terproteksi Token & Role Admin)
// ===================================

// Ambil semua konten untuk panel Admin (termasuk draf & counter)
router.get('/admin/all', verifyToken, verifyRole('admin'), contentController.getAllAdminContents);

// Buat konten baru (dengan upload gambar thumbnail & file video opsional)
router.post('/', verifyToken, verifyRole('admin'), uploadContentMedia, contentController.createContent);

// Ambil detail konten by id
router.get('/:id', contentController.getContentById);

// Update konten
router.put('/:id', verifyToken, verifyRole('admin'), uploadContentMedia, contentController.updateContent);

// Toggle / update status (draft <-> distribusikan)
router.patch('/:id/status', verifyToken, verifyRole('admin'), contentController.toggleStatus);

// Hapus konten
router.delete('/:id', verifyToken, verifyRole('admin'), contentController.deleteContent);

module.exports = router;
