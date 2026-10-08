const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const db = require('../config/db');

const OTP_LENGTH = 6;
const OTP_EXPIRES_MINUTES = 5;
const OTP_RESEND_COOLDOWN_SECONDS = 60;
const OTP_MAX_ATTEMPTS = 5;

let tableReady = null;

// Tabel dibuat otomatis agar tidak perlu migrasi manual
function ensureTable() {
  if (!tableReady) {
    tableReady = db.query(`
      CREATE TABLE IF NOT EXISTS otp_codes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        purpose VARCHAR(32) NOT NULL,
        code_hash VARCHAR(255) NOT NULL,
        attempts INT NOT NULL DEFAULT 0,
        expires_at DATETIME NOT NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_otp_email_purpose (email, purpose)
      )
    `).catch((err) => {
      tableReady = null;
      throw err;
    });
  }
  return tableReady;
}

function normalizeEmail(email) {
  return String(email || '').toLowerCase().trim();
}

class OtpModel {
  static get EXPIRES_MINUTES() {
    return OTP_EXPIRES_MINUTES;
  }

  /**
   * Sisa detik sebelum OTP boleh dikirim ulang (0 jika sudah boleh)
   */
  static async getCooldownSeconds(email, purpose) {
    await ensureTable();
    const [rows] = await db.query(
      `SELECT TIMESTAMPDIFF(SECOND, created_at, NOW()) AS age
       FROM otp_codes WHERE email = ? AND purpose = ?
       ORDER BY created_at DESC LIMIT 1`,
      [normalizeEmail(email), purpose]
    );
    if (rows.length === 0) return 0;
    return Math.max(0, OTP_RESEND_COOLDOWN_SECONDS - Number(rows[0].age));
  }

  /**
   * Buat OTP baru (OTP lama untuk email & tujuan yang sama dihapus)
   * @returns {Promise<{ id: number, code: string }>}
   */
  static async create(email, purpose) {
    await ensureTable();
    const code = crypto.randomInt(0, 10 ** OTP_LENGTH).toString().padStart(OTP_LENGTH, '0');
    const codeHash = await bcrypt.hash(code, 10);
    const normalized = normalizeEmail(email);

    await db.query('DELETE FROM otp_codes WHERE email = ? AND purpose = ?', [normalized, purpose]);
    const [result] = await db.query(
      `INSERT INTO otp_codes (email, purpose, code_hash, expires_at, created_at)
       VALUES (?, ?, ?, DATE_ADD(NOW(), INTERVAL ? MINUTE), NOW())`,
      [normalized, purpose, codeHash, OTP_EXPIRES_MINUTES]
    );

    return { id: result.insertId, code };
  }

  static async remove(id) {
    await ensureTable();
    await db.query('DELETE FROM otp_codes WHERE id = ?', [id]);
  }

  /**
   * Verifikasi OTP. OTP dihapus bila berhasil, kedaluwarsa, atau salah terlalu sering.
   * @returns {Promise<{ valid: boolean, message?: string }>}
   */
  static async verify(email, purpose, code) {
    await ensureTable();
    const normalized = normalizeEmail(email);
    const [rows] = await db.query(
      `SELECT id, code_hash, attempts, expires_at < NOW() AS expired
       FROM otp_codes WHERE email = ? AND purpose = ?
       ORDER BY created_at DESC LIMIT 1`,
      [normalized, purpose]
    );

    if (rows.length === 0) {
      return { valid: false, message: 'Kode OTP tidak ditemukan. Silakan minta kode baru.' };
    }

    const otp = rows[0];

    if (Number(otp.expired)) {
      await db.query('DELETE FROM otp_codes WHERE id = ?', [otp.id]);
      return { valid: false, message: 'Kode OTP sudah kedaluwarsa. Silakan minta kode baru.' };
    }

    if (otp.attempts >= OTP_MAX_ATTEMPTS) {
      await db.query('DELETE FROM otp_codes WHERE id = ?', [otp.id]);
      return { valid: false, message: 'Terlalu banyak percobaan. Silakan minta kode OTP baru.' };
    }

    const isMatch = await bcrypt.compare(String(code || '').trim(), otp.code_hash);
    if (!isMatch) {
      await db.query('UPDATE otp_codes SET attempts = attempts + 1 WHERE id = ?', [otp.id]);
      const left = OTP_MAX_ATTEMPTS - otp.attempts - 1;
      return {
        valid: false,
        message: left > 0
          ? `Kode OTP salah. Sisa percobaan: ${left}.`
          : 'Kode OTP salah. Silakan minta kode OTP baru.'
      };
    }

    await db.query('DELETE FROM otp_codes WHERE id = ?', [otp.id]);
    return { valid: true };
  }
}

module.exports = OtpModel;
