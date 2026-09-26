const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware');

// Endpoint Registrasi User
router.post('/register', authController.register);

// Endpoint Login User & Admin
router.post('/login', authController.login);

// Endpoint Mendapatkan Profil User Aktif (Protected)
router.get('/me', verifyToken, authController.getMe);

// Endpoint Ubah Password User Aktif (Protected)
router.put('/change-password', verifyToken, authController.changePassword);

module.exports = router;
