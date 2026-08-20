const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');

const JWT_SECRET = process.env.JWT_SECRET || 'siap_siaga_secret_2026';
const JWT_EXPIRES_IN = '7d';

/**
 * Controller untuk Registrasi User Baru
 */
async function register(req, res) {
  try {
    const { name, email, password, confirmPassword } = req.body;

    // 1. Validasi field wajib
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Nama lengkap wajib diisi.'
      });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Email wajib diisi.'
      });
    }

    // 2. Validasi format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({
        success: false,
        message: 'Format email tidak valid.'
      });
    }

    // 3. Validasi password
    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Password wajib diisi.'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password minimal terdiri dari 6 karakter.'
      });
    }

    if (confirmPassword !== undefined && password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Konfirmasi password tidak cocok.'
      });
    }

    // 4. Cek apakah email sudah terdaftar
    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email sudah terdaftar. Silakan gunakan email lain atau login.'
      });
    }

    // 5. Hash password dengan bcrypt
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    // 6. Simpan user baru (Role selalu 'user', Status selalu 'aktif')
    const newUser = await UserModel.createUser({
      name: name.trim(),
      email: email.trim(),
      password_hash,
      role: 'user',
      status: 'aktif',
      avatar_url: null
    });

    // 7. Generate token JWT
    const token = jwt.sign(
      {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return res.status(201).json({
      success: true,
      message: 'Registrasi berhasil! Akun Anda telah aktif.',
      data: {
        user: newUser,
        token
      }
    });

  } catch (error) {
    console.error('REGISTER ERROR:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat registrasi. Silakan coba lagi.'
    });
  }
}

/**
 * Controller untuk Login User / Admin
 */
async function login(req, res) {
  try {
    const { email, password } = req.body;

    // 1. Validasi input
    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Email wajib diisi.'
      });
    }

    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Password wajib diisi.'
      });
    }

    // 2. Cari user berdasarkan email
    const user = await UserModel.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email atau kata sandi salah.'
      });
    }

    // 3. Cek status akun
    if (user.status !== 'aktif') {
      return res.status(403).json({
        success: false,
        message: 'Akun Anda dinonaktifkan. Silakan hubungi administrator.'
      });
    }

    // 4. Verifikasi password hash
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Email atau kata sandi salah.'
      });
    }

    // 5. Generate token JWT
    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // 6. Respon data user tanpa password_hash
    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      avatar_url: user.avatar_url,
      created_at: user.created_at
    };

    return res.json({
      success: true,
      message: 'Login berhasil!',
      data: {
        user: userData,
        token
      }
    });

  } catch (error) {
    console.error('LOGIN ERROR:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat login pada server.'
    });
  }
}

/**
 * Controller untuk mendapatkan data profil user yang sedang login
 */
async function getMe(req, res) {
  try {
    return res.json({
      success: true,
      data: {
        user: req.user
      }
    });
  } catch (error) {
    console.error('GET ME ERROR:', error);
    return res.status(500).json({
      success: false,
      message: 'Gagal memuat profil pengguna.'
    });
  }
}

module.exports = {
  register,
  login,
  getMe
};
