const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware');

// Endpoint Kirim Kode OTP ke Email (register / reset_password)
router.post('/otp/request', authController.requestOtp);

// Endpoint Registrasi User (wajib menyertakan kode OTP)
router.post('/register', authController.register);

// Endpoint Lupa Password (reset menggunakan kode OTP)
router.post('/reset-password', authController.resetPassword);

// Endpoint Login User & Admin
router.post('/login', authController.login);

// Endpoint Mendapatkan Profil User Aktif (Protected)
router.get('/me', verifyToken, authController.getMe);

// Endpoint Ubah Password User Aktif (Protected)
router.put('/change-password', verifyToken, authController.changePassword);

module.exports = router;
