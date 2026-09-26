const db = require('../config/db');

class ReportModel {
  /**
   * Membuat laporan insiden baru dari pengguna
   * @param {object} param0 
   * @returns {Promise<object>}
   */
  static async createReport({
    user_id = null,
    disaster_type = 'lainnya',
    location_text,
    latitude = null,
    longitude = null,
    description = null,
    photo_url = null,
    status = 'menunggu'
  }) {
    const validDisasters = ['banjir', 'gempa_bumi', 'tsunami', 'kebakaran', 'longsor', 'angin_kencang', 'lainnya'];
    const finalDisaster = validDisasters.includes(disaster_type) ? disaster_type : 'lainnya';
    const finalStatus = ['menunggu', 'divalidasi', 'ditolak'].includes(status) ? status : 'menunggu';

    const [result] = await db.query(
      `INSERT INTO incident_reports 
        (user_id, disaster_type, location_text, latitude, longitude, description, photo_url, status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        user_id,
        finalDisaster,
        location_text.trim(),
        latitude !== null && latitude !== undefined && latitude !== '' ? parseFloat(latitude) : null,
        longitude !== null && longitude !== undefined && longitude !== '' ? parseFloat(longitude) : null,
        description ? description.trim() : null,
        photo_url ? photo_url.trim() : null,
        finalStatus
      ]
    );

    return this.findById(result.insertId);
  }

  /**
   * Mengambil semua laporan untuk Admin (dengan filter & info pelapor/validator)
   * @param {object} param0 
   * @returns {Promise<Array>}
   */
  static async getAllReports({ status = '', disaster_type = '', search = '' } = {}) {
    let sql = `
      SELECT 
        r.*,
        u.name AS reporter_name,
        u.email AS reporter_email,
        u.avatar_url AS reporter_avatar,
        v.name AS validator_name,
        v.email AS validator_email
      FROM incident_reports r
      LEFT JOIN users u ON r.user_id = u.id
      LEFT JOIN users v ON r.validated_by = v.id
      WHERE 1=1
    `;
    const params = [];

    if (status && status !== 'Semua Status' && status !== 'all') {
      sql += ' AND r.status = ?';
      params.push(status.toLowerCase());
    }

    if (disaster_type && disaster_type !== 'Semua Jenis' && disaster_type !== 'all') {
      sql += ' AND r.disaster_type = ?';
      params.push(disaster_type.toLowerCase());
    }

    if (search && search.trim() !== '') {
      sql += ' AND (r.location_text LIKE ? OR r.description LIKE ? OR u.name LIKE ? OR u.email LIKE ?)';
      const term = `%${search.trim()}%`;
      params.push(term, term, term, term);
    }

    sql += ' ORDER BY r.created_at DESC';

    const [rows] = await db.query(sql, params);
    return rows;
  }

  /**
   * Mengambil daftar laporan berstatus 'divalidasi' untuk feed publik / map
   * @param {object} param0 
   * @returns {Promise<Array>}
   */
  static async getValidatedReports({ disaster_type = '', search = '' } = {}) {
    let sql = `
      SELECT 
        r.*,
        u.name AS reporter_name,
        u.avatar_url AS reporter_avatar
      FROM incident_reports r
      LEFT JOIN users u ON r.user_id = u.id
      WHERE r.status = 'divalidasi'
    `;
    const params = [];

    if (disaster_type && disaster_type !== 'Semua' && disaster_type !== 'all') {
      sql += ' AND r.disaster_type = ?';
      params.push(disaster_type.toLowerCase());
    }

    if (search && search.trim() !== '') {
      sql += ' AND (r.location_text LIKE ? OR r.description LIKE ?)';
      const term = `%${search.trim()}%`;
      params.push(term, term);
    }

    sql += ' ORDER BY r.validated_at DESC, r.created_at DESC';

    const [rows] = await db.query(sql, params);
    return rows;
  }

  /**
   * Mengambil riwayat laporan pengguna tertentu
   * @param {number} userId 
   * @returns {Promise<Array>}
   */
  static async getUserReports(userId) {
    const [rows] = await db.query(
      `SELECT r.*, v.name AS validator_name
       FROM incident_reports r
       LEFT JOIN users v ON r.validated_by = v.id
       WHERE r.user_id = ?
       ORDER BY r.created_at DESC`,
      [userId]
    );
    return rows;
  }

  /**
   * Mengambil detail satu laporan berdasarkan ID
   * @param {number} id 
   * @returns {Promise<object|null>}
   */
  static async findById(id) {
    const [rows] = await db.query(
      `SELECT 
        r.*,
        u.name AS reporter_name,
        u.email AS reporter_email,
        u.avatar_url AS reporter_avatar,
        v.name AS validator_name,
        v.email AS validator_email
       FROM incident_reports r
       LEFT JOIN users u ON r.user_id = u.id
       LEFT JOIN users v ON r.validated_by = v.id
       WHERE r.id = ?
       LIMIT 1`,
      [id]
    );
    return rows.length > 0 ? rows[0] : null;
  }

  /**
   * Mengubah status laporan (misal: 'divalidasi' atau 'ditolak')
   * @param {number} id 
   * @param {object} param1 { status, validated_by }
   * @returns {Promise<object|null>}
   */
  static async updateReportStatus(id, { status, validated_by }) {
    const validStatuses = ['menunggu', 'divalidasi', 'ditolak'];
    if (!validStatuses.includes(status)) return null;

    const validatedAt = status === 'menunggu' ? null : new Date();

    await db.query(
      `UPDATE incident_reports 
       SET status = ?, validated_by = ?, validated_at = ?
       WHERE id = ?`,
      [status, validated_by, validatedAt, id]
    );

    return this.findById(id);
  }

  /**
   * Menghapus laporan
   * @param {number} id 
   * @returns {Promise<boolean>}
   */
  static async deleteReport(id) {
    const [result] = await db.query('DELETE FROM incident_reports WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  /**
   * Mengambil statistik ringkasan laporan
   * @returns {Promise<object>}
   */
  static async getStats() {
    const [rows] = await db.query(`
      SELECT 
        COUNT(*) AS total,
        SUM(CASE WHEN status = 'menunggu' THEN 1 ELSE 0 END) AS menunggu,
        SUM(CASE WHEN status = 'divalidasi' THEN 1 ELSE 0 END) AS divalidasi,
        SUM(CASE WHEN status = 'ditolak' THEN 1 ELSE 0 END) AS ditolak
      FROM incident_reports
    `);

    return rows[0] || {
      total: 0,
      menunggu: 0,
      divalidasi: 0,
      ditolak: 0
    };
  }
}

module.exports = ReportModel;
