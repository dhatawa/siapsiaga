const UserModel = require('../models/userModel');

/**
 * Mendapatkan daftar user biasa (role 'user' saja) dengan filter pencarian & status
 */
async function getUsers(req, res) {
  try {
    const { search, status } = req.query;
    const users = await UserModel.getUsers({ search, status });

    return res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    console.error('GET USERS ERROR:', error);
    return res.status(500).json({
      success: false,
      message: 'Gagal mengambil data pengguna.'
    });
  }
}

/**
 * Mendapatkan detail user berdasarkan ID
 */
async function getUserById(req, res) {
  try {
    const { id } = req.params;
    const user = await UserModel.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Pengguna tidak ditemukan.'
      });
    }

    return res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('GET USER BY ID ERROR:', error);
    return res.status(500).json({
      success: false,
      message: 'Gagal mengambil detail pengguna.'
    });
  }
}

/**
 * Mengedit profil user (nama, email, status, avatar)
 */
async function updateUser(req, res) {
  try {
    const { id } = req.params;
    const { name, email, status } = req.body;

    const user = await UserModel.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Pengguna tidak ditemukan.'
      });
    }

    const updates = {};
    if (name) updates.name = name.trim();
    if (email) updates.email = email.toLowerCase().trim();
    if (status) updates.status = status;

    // Jika ada file foto yang diunggah
    if (req.file) {
      const avatarPath = `${req.protocol}://${req.get('host')}/uploads/avatars/${req.file.filename}`;
      updates.avatar_url = avatarPath;
    }

    // Jika email diubah, pastikan tidak bentrok dengan user lain
    if (updates.email && updates.email !== user.email) {
      const existingUser = await UserModel.findByEmail(updates.email);
      if (existingUser && existingUser.id !== parseInt(id)) {
        return res.status(400).json({
          success: false,
          message: 'Email sudah digunakan oleh akun lain.'
        });
      }
    }

    const success = await UserModel.updateUser(id, updates);

    if (!success && !req.file) {
      return res.status(400).json({
        success: false,
        message: 'Tidak ada perubahan data yang disimpan.'
      });
    }

    const updatedUser = await UserModel.findById(id);

    return res.json({
      success: true,
      message: 'Data pengguna berhasil diperbarui.',
      data: updatedUser
    });
  } catch (error) {
    console.error('UPDATE USER ERROR:', error);
    return res.status(500).json({
      success: false,
      message: 'Gagal memperbarui data pengguna.'
    });
  }
}

/**
 * Mengubah status aktif / tidak_aktif pengguna
 */
async function toggleUserStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const user = await UserModel.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Pengguna tidak ditemukan.'
      });
    }

    const newStatus = status || (user.status === 'aktif' ? 'tidak_aktif' : 'aktif');
    await UserModel.updateUser(id, { status: newStatus });

    const updatedUser = await UserModel.findById(id);

    return res.json({
      success: true,
      message: `Status pengguna berhasil diubah menjadi ${newStatus}.`,
      data: updatedUser
    });
  } catch (error) {
    console.error('TOGGLE USER STATUS ERROR:', error);
    return res.status(500).json({
      success: false,
      message: 'Gagal mengubah status pengguna.'
    });
  }
}

/**
 * Menghapus pengguna
 */
async function deleteUser(req, res) {
  try {
    const { id } = req.params;

    const user = await UserModel.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Pengguna tidak ditemukan.'
      });
    }

    if (user.role === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Akun admin tidak dapat dihapus.'
      });
    }

    const deleted = await UserModel.deleteUser(id);
    if (!deleted) {
      return res.status(400).json({
        success: false,
        message: 'Gagal menghapus pengguna.'
      });
    }

    return res.json({
      success: true,
      message: 'Pengguna berhasil dihapus.'
    });
  } catch (error) {
    console.error('DELETE USER ERROR:', error);
    return res.status(500).json({
      success: false,
      message: 'Gagal menghapus data pengguna.'
    });
  }
}

module.exports = {
  getUsers,
  getUserById,
  updateUser,
  toggleUserStatus,
  deleteUser
};
