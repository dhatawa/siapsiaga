const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
require('dotenv').config();

// Debug: tampilkan config
console.log('🔍 Database Config:');
console.log('Host:', process.env.DB_HOST);
console.log('User:', process.env.DB_USER);
console.log('Password:', process.env.DB_PASSWORD ? '***' : '(kosong)');
console.log('Database:', process.env.DB_NAME);
console.log('Port:', process.env.DB_PORT);

// Konfigurasi database
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'siap_siaga',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function createUser() {
  try {
    const connection = await pool.getConnection();

    // Data user yang akan dibuat
    const name = 'Admin Test';
    const email = 'admin@test.com';
    const password = 'password123';
    const role = 'user'; // atau 'admin' jika ingin role admin
    const status = 'aktif';

    // Hash password
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    // Cek apakah email sudah ada
    const [rows] = await connection.query(
      'SELECT id FROM users WHERE email = ? LIMIT 1',
      [email]
    );

    if (rows.length > 0) {
      console.log('❌ Email sudah terdaftar!');
      connection.release();
      process.exit(1);
    }

    // Insert user baru
    const [result] = await connection.query(
      'INSERT INTO users (name, email, password_hash, role, status, avatar_url, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())',
      [name, email, password_hash, role, status, null]
    );

    console.log('✅ User berhasil dibuat!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Email    : ' + email);
    console.log('Password : ' + password);
    console.log('Role     : ' + role);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    connection.release();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createUser();
