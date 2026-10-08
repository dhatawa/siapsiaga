const path = require('path');

// Semua variabel lingkungan dipusatkan di file .env pada root folder siapsiaga
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
