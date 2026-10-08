// Konfigurasi dibaca dari .env root folder siapsiaga (lihat envDir di vite.config.js)
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const CHATBOT_URL = import.meta.env.VITE_CHATBOT_URL || 'http://localhost:3000';
export const MAP_API_KEY = import.meta.env.VITE_MAP_API_KEY || '';
