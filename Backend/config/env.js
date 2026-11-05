const path = require('path');
const dotenv = require('dotenv');

// Prioritaskan .env di backend, lalu fallback ke root folder siapsiaga jika ada
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
