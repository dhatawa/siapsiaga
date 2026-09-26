const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');

const JWT_SECRET = process.env.JWT_SECRET || 'siap_siaga_secret_2026';

/**
 * Middleware untuk memverifikasi JWT token
 */
async function verifyToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Akses ditolak. Token autentikasi tidak ditemukan.'
      });
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, JWT_SECRET);

    // Ambil data user terkini dari database
    const user = await UserModel.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User tidak ditemukan atau sesi sudah kadaluarsa.'
      });
    }

    if (user.status !== 'aktif') {
      return res.status(403).json({
        success: false,
        message: 'Akun Anda dinonaktifkan. Silakan hubungi admin.'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Sesi telah berakhir. Silakan login kembali.'
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Token tidak valid.'
    });
  }
}

/**
 * Middleware untuk otorisasi berdasarkan role (misal: 'admin')
 * @param  {...string} allowedRoles 
 */
function verifyRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Akses ditolak. Anda tidak memiliki izin untuk mengakses halaman ini.'
      });
    }
    next();
  };
}

module.exports = {
  verifyToken,
  verifyRole
};
