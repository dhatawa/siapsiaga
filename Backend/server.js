const express = require('express');
const cors = require('cors');
require('dotenv').config();

const newsRoutes = require('./routes/newsRoutes');
const bmkgRoutes = require('./routes/bmkgRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

const PORT = process.env.PORT || 5000;

// ===============================
// MIDDLEWARE
// ===============================

app.use(cors());
app.use(express.json());

// ===============================
// ROOT
// ===============================

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Backend Siap Siaga berhasil berjalan'
  });
});

// ===============================
// TEST API
// ===============================

app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'API berhasil terhubung'
  });
});

// ===============================
// ROUTES
// ===============================

app.use('/api/auth', authRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/bmkg', bmkgRoutes);

// ===============================
// 404
// ===============================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint tidak ditemukan'
  });
});

// ===============================
// ERROR HANDLER
// ===============================

app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    success: false,
    message: 'Terjadi kesalahan pada server'
  });
});

// ===============================
// SERVER
// ===============================

app.listen(PORT, () => {
  console.log('');
  console.log('================================');
  console.log('  SIAP SIAGA BACKEND');
  console.log('================================');
  console.log(`  Server : http://localhost:${PORT}`);
  console.log(`  Test   : http://localhost:${PORT}/api/test`);
  console.log(`  Auth   : http://localhost:${PORT}/api/auth`);
  console.log(`  News   : http://localhost:${PORT}/api/news`);
  console.log(`  BMKG   : http://localhost:${PORT}/api/bmkg/earthquake`);
  console.log('================================');
  console.log('');
});