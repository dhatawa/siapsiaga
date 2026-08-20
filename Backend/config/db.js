const mysql = require('mysql2/promise');
require('dotenv').config();

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

// Test connection on startup
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log('  MySQL  : Terhubung ke database MySQL (' + (process.env.DB_NAME || 'siap_siaga') + ')');
    connection.release();
  } catch (error) {
    console.error('  MySQL Error : Gagal terhubung ke database:', error.message);
  }
})();

module.exports = pool;
