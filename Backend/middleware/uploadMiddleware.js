const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Direktori upload
const avatarsDir = path.join(__dirname, '../uploads/avatars');
const thumbnailsDir = path.join(__dirname, '../uploads/thumbnails');
const videosDir = path.join(__dirname, '../uploads/videos');
const reportsDir = path.join(__dirname, '../uploads/reports');

[avatarsDir, thumbnailsDir, videosDir, reportsDir].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// ===================================
// Storage & Filter untuk Avatar
// ===================================
const avatarStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, avatarsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, 'avatar-' + uniqueSuffix + ext);
  }
});

const imageFileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp|gif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Hanya file gambar (JPG, PNG, WEBP, GIF) yang diperbolehkan!'));
  }
};

const uploadAvatar = multer({
  storage: avatarStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Maksimal 5MB
  fileFilter: imageFileFilter
});

// ===================================
// Storage & Filter untuk Konten (Thumbnail + Video)
// ===================================
const contentStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === 'thumbnail') {
      cb(null, thumbnailsDir);
    } else if (file.fieldname === 'video') {
      cb(null, videosDir);
    } else {
      cb(null, path.join(__dirname, '../uploads'));
    }
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase();
    const prefix = file.fieldname === 'thumbnail' ? 'thumb-' : file.fieldname === 'video' ? 'vid-' : 'file-';
    cb(null, prefix + uniqueSuffix + ext);
  }
});

const contentFileFilter = (req, file, cb) => {
  if (file.fieldname === 'thumbnail') {
    const allowedImages = /jpeg|jpg|png|webp|gif/;
    const extname = allowedImages.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedImages.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    return cb(new Error('Thumbnail harus berupa file gambar (JPG, JPEG, PNG, WEBP, GIF).'));
  } else if (file.fieldname === 'video') {
    const allowedVideos = /mp4|webm|mkv|mov|avi|3gp/;
    const extname = allowedVideos.test(path.extname(file.originalname).toLowerCase());
    const mimetype = file.mimetype.startsWith('video/') || allowedVideos.test(path.extname(file.originalname).toLowerCase());
    if (extname || mimetype) {
      return cb(null, true);
    }
    return cb(new Error('Video harus berupa file video (MP4, WEBM, MKV, MOV, AVI).'));
  }
  cb(null, true);
};

const uploadContentMedia = multer({
  storage: contentStorage,
  limits: { fileSize: 100 * 1024 * 1024 }, // Maksimal 100MB untuk video
  fileFilter: contentFileFilter
}).fields([
  { name: 'thumbnail', maxCount: 1 },
  { name: 'video', maxCount: 1 }
]);

// ===================================
// Storage & Filter untuk Foto Laporan Kejadian (Incident Reports)
// ===================================
const reportStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, reportsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, 'report-' + uniqueSuffix + ext);
  }
});

const uploadReportPhoto = multer({
  storage: reportStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Maksimal 10MB
  fileFilter: imageFileFilter
});

module.exports = {
  uploadAvatar,
  uploadContentMedia,
  uploadReportPhoto
};
