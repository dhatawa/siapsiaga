const db = require('../config/db');

class UserModel {
  /**
   * Cari user berdasarkan email
   * @param {string} email 
   * @returns {Promise<object|null>}
   */
  static async findByEmail(email) {
    const [rows] = await db.query(
      'SELECT id, name, email, password_hash, role, status, avatar_url, created_at, updated_at FROM users WHERE email = ? LIMIT 1',
      [email.toLowerCase().trim()]
    );
    return rows.length > 0 ? rows[0] : null;
  }

  /**
   * Cari user berdasarkan ID (tanpa password_hash untuk keamanan)
   * @param {number} id 
   * @returns {Promise<object|null>}
   */
  static async findById(id) {
    const [rows] = await db.query(
      'SELECT id, name, email, role, status, avatar_url, created_at, updated_at FROM users WHERE id = ? LIMIT 1',
      [id]
    );
    return rows.length > 0 ? rows[0] : null;
  }

  /**
   * Buat user baru (Role default adalah 'user' dan status 'aktif')
   * @param {object} userData 
   * @returns {Promise<object>}
   */
  static async createUser({ name, email, password_hash, role = 'user', status = 'aktif', avatar_url = null }) {
    // Pastikan role selalu 'user' jika registrasi publik
    const userRole = role === 'admin' ? 'admin' : 'user';
    const userStatus = status || 'aktif';

    const [result] = await db.query(
      'INSERT INTO users (name, email, password_hash, role, status, avatar_url, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())',
      [name.trim(), email.toLowerCase().trim(), password_hash, userRole, userStatus, avatar_url]
    );

    return {
      id: result.insertId,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      role: userRole,
      status: userStatus,
      avatar_url: avatar_url
    };
  }

  /**
   * Ambil semua user (untuk modul admin)
   * @returns {Promise<Array>}
   */
  static async getAllUsers() {
    const [rows] = await db.query(
      'SELECT id, name, email, role, status, avatar_url, created_at, updated_at FROM users ORDER BY created_at DESC'
    );
    return rows;
  }

  /**
   * Update status atau profil user
   * @param {number} id 
   * @param {object} fields 
   * @returns {Promise<boolean>}
   */
  static async updateUser(id, fields) {
    const validFields = ['name', 'avatar_url', 'status', 'role'];
    const updates = [];
    const values = [];

    for (const key of Object.keys(fields)) {
      if (validFields.includes(key) && fields[key] !== undefined) {
        updates.push(`${key} = ?`);
        values.push(fields[key]);
      }
    }

    if (updates.length === 0) return false;

    values.push(id);
    const [result] = await db.query(
      `UPDATE users SET ${updates.join(', ')}, updated_at = NOW() WHERE id = ?`,
      values
    );

    return result.affectedRows > 0;
  }
}

module.exports = UserModel;
