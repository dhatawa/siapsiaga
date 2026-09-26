const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

// Ambil notifikasi terpadu (Publik / Pengguna)
router.get('/', notificationController.getNotifications);

// Tandai semua dibaca
router.post('/read-all', notificationController.markAllAsRead);

module.exports = router;
