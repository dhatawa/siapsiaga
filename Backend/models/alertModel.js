const db = require('../config/db');

class AlertModel {
  /**
   * Membuat siaran peringatan darurat baru dari admin
   */
  static async createAlert({
    created_by,
    level = 'bahaya',
    message,
    target_areas = ['Semua Wilayah'],
    status = 'terkirim'
  }) {
    const validLevels = ['info', 'peringatan', 'bahaya'];
    const finalLevel = validLevels.includes(level) ? level : 'bahaya';
    const finalTargetAreas = Array.isArray(target_areas) ? target_areas : [target_areas];

    const [result] = await db.query(
      `INSERT INTO alerts (created_by, level, message, target_areas, status, sent_at)
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [
        created_by,
        finalLevel,
        message.trim(),
        JSON.stringify(finalTargetAreas),
        status
      ]
    );

    return this.findById(result.insertId);
  }

  /**
   * Mengambil semua riwayat siaran peringatan untuk admin
   */
  static async getAllAlerts({ limit = 50 } = {}) {
    const [rows] = await db.query(
      `SELECT a.*, u.name AS author_name, u.email AS author_email
       FROM alerts a
       LEFT JOIN users u ON a.created_by = u.id
       ORDER BY a.sent_at DESC
       LIMIT ?`,
      [limit]
    );

    return rows.map((r) => ({
      ...r,
      target_areas: typeof r.target_areas === 'string' ? JSON.parse(r.target_areas) : r.target_areas
    }));
  }

  /**
   * Mengambil siaran peringatan terbaru yang berstatus 'terkirim'
   */
  static async getRecentAlerts(limit = 10) {
    const [rows] = await db.query(
      `SELECT a.*, u.name AS author_name
       FROM alerts a
       LEFT JOIN users u ON a.created_by = u.id
       WHERE a.status = 'terkirim'
       ORDER BY a.sent_at DESC
       LIMIT ?`,
      [limit]
    );

    return rows.map((r) => ({
      ...r,
      target_areas: typeof r.target_areas === 'string' ? JSON.parse(r.target_areas) : r.target_areas
    }));
  }

  /**
   * Mengambil satu alert berdasarkan ID
   */
  static async findById(id) {
    const [rows] = await db.query(
      `SELECT a.*, u.name AS author_name, u.email AS author_email
       FROM alerts a
       LEFT JOIN users u ON a.created_by = u.id
       WHERE a.id = ?
       LIMIT 1`,
      [id]
    );

    if (rows.length === 0) return null;

    const row = rows[0];
    return {
      ...row,
      target_areas: typeof row.target_areas === 'string' ? JSON.parse(row.target_areas) : row.target_areas
    };
  }

  /**
   * Menghapus siaran peringatan
   */
  static async deleteAlert(id) {
    const [result] = await db.query('DELETE FROM alerts WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
}

module.exports = AlertModel;
