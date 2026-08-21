const db = require('../config/db');

class ContentModel {
  /**
   * Menghasilkan slug unik dari judul
   * @param {string} title 
   * @param {number|null} currentId 
   * @returns {Promise<string>}
   */
  static async generateUniqueSlug(title, currentId = null) {
    let baseSlug = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

    if (!baseSlug) {
      baseSlug = 'konten-' + Date.now();
    }

    let slug = baseSlug;
    let counter = 1;

    while (true) {
      let query = 'SELECT id FROM content WHERE slug = ?';
      const params = [slug];

      if (currentId) {
        query += ' AND id != ?';
        params.push(currentId);
      }

      const [rows] = await db.query(query, params);
      if (rows.length === 0) {
        return slug;
      }

      slug = `${baseSlug}-${counter}`;
      counter++;
    }
  }

  /**
   * Membuat konten baru
   * @param {object} param0 
   * @returns {Promise<object>}
   */
  static async createContent({
    created_by = null,
    type = 'artikel',
    category = 'Umum',
    title,
    slug = null,
    body = null,
    video_url = null,
    thumbnail_url = null,
    status = 'draft'
  }) {
    const finalSlug = slug ? await this.generateUniqueSlug(slug) : await this.generateUniqueSlug(title);
    const finalType = type === 'video' ? 'video' : 'artikel';
    const finalStatus = status === 'distribusikan' ? 'distribusikan' : 'draft';

    const [result] = await db.query(
      `INSERT INTO content (created_by, type, category, title, slug, body, video_url, thumbnail_url, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        created_by,
        finalType,
        category.trim(),
        title.trim(),
        finalSlug,
        body ? body.trim() : null,
        video_url ? video_url.trim() : null,
        thumbnail_url ? thumbnail_url.trim() : null,
        finalStatus
      ]
    );

    return this.findById(result.insertId);
  }

  /**
   * Mengambil daftar konten untuk Admin (dengan filter)
   * @param {object} param0 
   * @returns {Promise<Array>}
   */
  static async getContents({ search = '', type = '', category = '', status = '' } = {}) {
    let sql = `
      SELECT c.*, u.name AS author_name, u.avatar_url AS author_avatar
      FROM content c
      LEFT JOIN users u ON c.created_by = u.id
      WHERE 1=1
    `;
    const params = [];

    if (search && search.trim() !== '') {
      sql += ' AND (c.title LIKE ? OR c.category LIKE ? OR c.body LIKE ?)';
      const term = `%${search.trim()}%`;
      params.push(term, term, term);
    }

    if (type && type !== 'Semua' && type !== 'all') {
      sql += ' AND c.type = ?';
      params.push(type.toLowerCase());
    }

    if (category && category !== 'Semua' && category !== 'all') {
      sql += ' AND c.category = ?';
      params.push(category);
    }

    if (status && status !== 'Semua Status' && status !== 'all') {
      sql += ' AND c.status = ?';
      params.push(status.toLowerCase());
    }

    sql += ' ORDER BY c.created_at DESC';

    const [rows] = await db.query(sql, params);
    return rows;
  }

  /**
   * Mengambil daftar konten publik (hanya status 'distribusikan')
   * @param {object} param0 
   * @returns {Promise<Array>}
   */
  static async getPublicContents({ search = '', type = '', category = '' } = {}) {
    let sql = `
      SELECT c.*, u.name AS author_name
      FROM content c
      LEFT JOIN users u ON c.created_by = u.id
      WHERE c.status = 'distribusikan'
    `;
    const params = [];

    if (search && search.trim() !== '') {
      sql += ' AND (c.title LIKE ? OR c.category LIKE ? OR c.body LIKE ?)';
      const term = `%${search.trim()}%`;
      params.push(term, term, term);
    }

    if (type && type !== 'Semua' && type !== 'all') {
      sql += ' AND c.type = ?';
      params.push(type.toLowerCase());
    }

    if (category && category !== 'Semua' && category !== 'all') {
      sql += ' AND c.category = ?';
      params.push(category);
    }

    sql += ' ORDER BY c.created_at DESC';

    const [rows] = await db.query(sql, params);
    return rows;
  }

  /**
   * Mengambil detail konten berdasarkan ID
   * @param {number} id 
   * @returns {Promise<object|null>}
   */
  static async findById(id) {
    const [rows] = await db.query(
      `SELECT c.*, u.name AS author_name, u.avatar_url AS author_avatar
       FROM content c
       LEFT JOIN users u ON c.created_by = u.id
       WHERE c.id = ?
       LIMIT 1`,
      [id]
    );
    return rows.length > 0 ? rows[0] : null;
  }

  /**
   * Mengambil detail konten publik berdasarkan slug
   * @param {string} slug 
   * @returns {Promise<object|null>}
   */
  static async findBySlug(slug) {
    const [rows] = await db.query(
      `SELECT c.*, u.name AS author_name, u.avatar_url AS author_avatar
       FROM content c
       LEFT JOIN users u ON c.created_by = u.id
       WHERE c.slug = ?
       LIMIT 1`,
      [slug]
    );
    return rows.length > 0 ? rows[0] : null;
  }

  /**
   * Memperbarui konten
   * @param {number} id 
   * @param {object} fields 
   * @returns {Promise<boolean>}
   */
  static async updateContent(id, fields) {
    const validFields = ['type', 'category', 'title', 'slug', 'body', 'video_url', 'thumbnail_url', 'status'];
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
      `UPDATE content SET ${updates.join(', ')}, updated_at = NOW() WHERE id = ?`,
      values
    );

    return result.affectedRows > 0;
  }

  /**
   * Mengubah status konten (draft <-> distribusikan)
   * @param {number} id 
   * @param {string|null} newStatus 
   * @returns {Promise<object|null>}
   */
  static async toggleStatus(id, newStatus = null) {
    const content = await this.findById(id);
    if (!content) return null;

    const targetStatus = newStatus || (content.status === 'distribusikan' ? 'draft' : 'distribusikan');

    await db.query(
      'UPDATE content SET status = ?, updated_at = NOW() WHERE id = ?',
      [targetStatus, id]
    );

    return this.findById(id);
  }

  /**
   * Menghapus konten
   * @param {number} id 
   * @returns {Promise<boolean>}
   */
  static async deleteContent(id) {
    const [result] = await db.query('DELETE FROM content WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  /**
   * Mengambil statistik ringkasan konten untuk dashboard admin
   * @returns {Promise<object>}
   */
  static async getStats() {
    const [rows] = await db.query(`
      SELECT 
        COUNT(*) AS total,
        SUM(CASE WHEN status = 'distribusikan' THEN 1 ELSE 0 END) AS distribusikan,
        SUM(CASE WHEN status = 'draft' THEN 1 ELSE 0 END) AS draft,
        SUM(CASE WHEN type = 'artikel' THEN 1 ELSE 0 END) AS artikel,
        SUM(CASE WHEN type = 'video' THEN 1 ELSE 0 END) AS video
      FROM content
    `);

    return rows[0] || {
      total: 0,
      distribusikan: 0,
      draft: 0,
      artikel: 0,
      video: 0
    };
  }
}

module.exports = ContentModel;
