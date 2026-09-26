const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken, verifyRole } = require('../middleware/authMiddleware');
const { uploadAvatar } = require('../middleware/uploadMiddleware');

// Semua rute manajemen user ini dilindungi token (Admin)
router.use(verifyToken);
router.use(verifyRole('admin'));

// GET /api/users - Daftar user biasa dengan query search & status
router.get('/', userController.getUsers);

// GET /api/users/:id - Detail user
router.get('/:id', userController.getUserById);

// PUT /api/users/:id - Edit user dengan upload foto
router.put('/:id', uploadAvatar.single('avatar'), userController.updateUser);

// PATCH /api/users/:id/status - Toggle status aktif / tidak aktif
router.patch('/:id/status', userController.toggleUserStatus);

// DELETE /api/users/:id - Hapus user
router.delete('/:id', userController.deleteUser);

module.exports = router;
