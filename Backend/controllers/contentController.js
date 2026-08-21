const ContentModel = require('../models/contentModel');
const db = require('../config/db');
const path = require('path');
const fs = require('fs');

/**
 * Helper untuk menghapus file lokal jika ada
 */
function removeLocalFile(fileUrl) {
  if (!fileUrl) return;
  try {
    const urlParts = fileUrl.split('/uploads/');
    if (urlParts.length > 1) {
      const relativePath = urlParts[1];
      const fullPath = path.join(__dirname, '../uploads', relativePath);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    }
  } catch (err) {
    console.error('Gagal menghapus file lama:', err.message);
  }
}

/**
 * Mengambil semua konten untuk Admin (termasuk draf & terdistribusi)
 */
async function getAllAdminContents(req, res) {
  try {
    const { search, type, category, status } = req.query;
    const contents = await ContentModel.getContents({ search, type, category, status });
    const stats = await ContentModel.getStats();

    return res.json({
      success: true,
      count: contents.length,
      data: contents,
      stats: stats
    });
  } catch (error) {
    console.error('GET ALL ADMIN CONTENTS ERROR:', error);
    return res.status(500).json({
      success: false,
      message: 'Gagal mengambil data manajemen konten.'
    });
  }
}

/**
 * Mengambil semua konten terdistribusi untuk pengguna publik
 */
async function getPublicContents(req, res) {
  try {
    const { search, type, category } = req.query;
    const contents = await ContentModel.getPublicContents({ search, type, category });

    return res.json({
      success: true,
      count: contents.length,
      data: contents
    });
  } catch (error) {
    console.error('GET PUBLIC CONTENTS ERROR:', error);
    return res.status(500).json({
      success: false,
      message: 'Gagal mengambil data konten edukasi.'
    });
  }
}

/**
 * Mengambil detail konten berdasarkan ID
 */
async function getContentById(req, res) {
  try {
    const { id } = req.params;
    const content = await ContentModel.findById(id);

    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Konten tidak ditemukan.'
      });
    }

    return res.json({
      success: true,
      data: content
    });
  } catch (error) {
    console.error('GET CONTENT BY ID ERROR:', error);
    return res.status(500).json({
      success: false,
      message: 'Gagal mengambil detail konten.'
    });
  }
}

/**
 * Mengambil detail konten publik berdasarkan Slug
 */
async function getContentBySlug(req, res) {
  try {
    const { slug } = req.params;
    const content = await ContentModel.findBySlug(slug);

    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Konten tidak ditemukan.'
      });
    }

    // Jika bukan admin, pastikan status konten adalah 'distribusikan'
    if (content.status !== 'distribusikan') {
      return res.status(404).json({
        success: false,
        message: 'Konten masih dalam status draf atau belum dipublikasikan.'
      });
    }

    return res.json({
      success: true,
      data: content
    });
  } catch (error) {
    console.error('GET CONTENT BY SLUG ERROR:', error);
    return res.status(500).json({
      success: false,
      message: 'Gagal mengambil detail panduan edukasi.'
    });
  }
}

/**
 * Membuat konten baru (Admin)
 */
async function createContent(req, res) {
  try {
    const { title, type, category, body, status, slug } = req.body;
    let { video_url } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Judul konten wajib diisi.'
      });
    }

    const host = req.get('host');
    const protocol = req.protocol;

    let thumbnailUrl = null;
    if (req.files && req.files.thumbnail && req.files.thumbnail[0]) {
      thumbnailUrl = `${protocol}://${host}/uploads/thumbnails/${req.files.thumbnail[0].filename}`;
    }

    if (req.files && req.files.video && req.files.video[0]) {
      video_url = `${protocol}://${host}/uploads/videos/${req.files.video[0].filename}`;
    }

    const createdBy = req.user ? req.user.id : null;

    const newContent = await ContentModel.createContent({
      created_by: createdBy,
      type: type || 'artikel',
      category: category || 'Umum',
      title: title.trim(),
      slug: slug || null,
      body: body || '',
      video_url: video_url || null,
      thumbnail_url: thumbnailUrl,
      status: status || 'draft'
    });

    if (status === 'distribusikan') {
      try {
        const isVideo = type === 'video';
        await db.query(
          `INSERT INTO notifications (user_id, type, title, message, reference_id, is_read, created_at)
           VALUES (NULL, 'EDUKASI_BARU', ?, ?, ?, 0, NOW())`,
          [
            `${isVideo ? '🎬 Video Tutorial Baru' : '📚 Panduan Edukasi Baru'}: ${title.trim()}`,
            body ? body.replace(/[#*`_]/g, '').slice(0, 140) : 'Materi edukasi dan tips mitigasi keselamatan baru.',
            newContent.id
          ]
        );
      } catch (notifErr) {
        console.warn('Sync content to notifications error:', notifErr.message);
      }
    }

    return res.status(201).json({
      success: true,
      message: `Konten berhasil dibuat ${status === 'distribusikan' ? 'dan didistribusikan' : 'sebagai draf'}.`,
      data: newContent
    });
  } catch (error) {
    console.error('CREATE CONTENT ERROR:', error);
    return res.status(500).json({
      success: false,
      message: 'Gagal membuat konten baru: ' + (error.message || 'Kesalahan server')
    });
  }
}

/**
 * Memperbarui konten (Admin)
 */
async function updateContent(req, res) {
  try {
    const { id } = req.params;
    const existing = await ContentModel.findById(id);

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Konten tidak ditemukan.'
      });
    }

    const { title, type, category, body, status, slug } = req.body;
    let { video_url } = req.body;

    const updates = {};
    if (title !== undefined) updates.title = title.trim();
    if (type !== undefined) updates.type = type;
    if (category !== undefined) updates.category = category.trim();
    if (body !== undefined) updates.body = body;
    if (status !== undefined) updates.status = status;

    if (slug !== undefined && slug.trim() !== '' && slug !== existing.slug) {
      updates.slug = await ContentModel.generateUniqueSlug(slug, id);
    } else if (title && title !== existing.title && !slug) {
      updates.slug = await ContentModel.generateUniqueSlug(title, id);
    }

    const host = req.get('host');
    const protocol = req.protocol;

    // Cek file thumbnail baru
    if (req.files && req.files.thumbnail && req.files.thumbnail[0]) {
      // Hapus thumbnail lama jika ada
      removeLocalFile(existing.thumbnail_url);
      updates.thumbnail_url = `${protocol}://${host}/uploads/thumbnails/${req.files.thumbnail[0].filename}`;
    }

    // Cek file video baru
    if (req.files && req.files.video && req.files.video[0]) {
      removeLocalFile(existing.video_url);
      updates.video_url = `${protocol}://${host}/uploads/videos/${req.files.video[0].filename}`;
    } else if (video_url !== undefined) {
      updates.video_url = video_url ? video_url.trim() : null;
    }

    await ContentModel.updateContent(id, updates);
    const updatedContent = await ContentModel.findById(id);

    // Jika diubah menjadi status distribusikan, kirim notifikasi
    if (updates.status === 'distribusikan' && existing.status !== 'distribusikan') {
      try {
        const isVideo = updatedContent.type === 'video';
        await db.query(
          `INSERT INTO notifications (user_id, type, title, message, reference_id, is_read, created_at)
           VALUES (NULL, 'EDUKASI_BARU', ?, ?, ?, 0, NOW())`,
          [
            `${isVideo ? '🎬 Video Tutorial Baru' : '📚 Panduan Edukasi Baru'}: ${updatedContent.title}`,
            updatedContent.body ? updatedContent.body.replace(/[#*`_]/g, '').slice(0, 140) : 'Materi edukasi dan tips mitigasi keselamatan baru.',
            updatedContent.id
          ]
        );
      } catch (notifErr) {
        console.warn('Sync update content to notifications error:', notifErr.message);
      }
    }

    return res.json({
      success: true,
      message: 'Konten berhasil diperbarui.',
      data: updatedContent
    });
  } catch (error) {
    console.error('UPDATE CONTENT ERROR:', error);
    return res.status(500).json({
      success: false,
      message: 'Gagal memperbarui konten: ' + (error.message || 'Kesalahan server')
    });
  }
}

/**
 * Toggle atau ubah status konten (Admin)
 */
async function toggleStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updated = await ContentModel.toggleStatus(id, status);
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Konten tidak ditemukan.'
      });
    }

    // Jika diaktifkan ke distribusikan
    if (updated.status === 'distribusikan') {
      try {
        const isVideo = updated.type === 'video';
        await db.query(
          `INSERT INTO notifications (user_id, type, title, message, reference_id, is_read, created_at)
           VALUES (NULL, 'EDUKASI_BARU', ?, ?, ?, 0, NOW())`,
          [
            `${isVideo ? '🎬 Video Tutorial Baru' : '📚 Panduan Edukasi Baru'}: ${updated.title}`,
            updated.body ? updated.body.replace(/[#*`_]/g, '').slice(0, 140) : 'Materi edukasi dan tips mitigasi keselamatan baru.',
            updated.id
          ]
        );
      } catch (notifErr) {
        console.warn('Sync toggle content to notifications error:', notifErr.message);
      }
    }

    const actionText = updated.status === 'distribusikan' ? 'didistribusikan' : 'diubah menjadi draf';

    return res.json({
      success: true,
      message: `Konten berhasil ${actionText}.`,
      data: updated
    });
  } catch (error) {
    console.error('TOGGLE CONTENT STATUS ERROR:', error);
    return res.status(500).json({
      success: false,
      message: 'Gagal mengubah status konten.'
    });
  }
}

/**
 * Menghapus konten (Admin)
 */
async function deleteContent(req, res) {
  try {
    const { id } = req.params;
    const existing = await ContentModel.findById(id);

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Konten tidak ditemukan.'
      });
    }

    // Hapus file media lokal jika ada
    removeLocalFile(existing.thumbnail_url);
    removeLocalFile(existing.video_url);

    await ContentModel.deleteContent(id);

    return res.json({
      success: true,
      message: 'Konten berhasil dihapus secara permanen.'
    });
  } catch (error) {
    console.error('DELETE CONTENT ERROR:', error);
    return res.status(500).json({
      success: false,
      message: 'Gagal menghapus konten.'
    });
  }
}

module.exports = {
  getAllAdminContents,
  getPublicContents,
  getContentById,
  getContentBySlug,
  createContent,
  updateContent,
  toggleStatus,
  deleteContent
};
