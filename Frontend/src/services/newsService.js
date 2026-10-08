import { API_URL } from '../config';

const API_BASE_URL = `${API_URL}/news`;

export const newsService = {
  /**
   * Ambil daftar berita kebencanaan terbaru (GNews via backend)
   */
  async getNews() {
    const response = await fetch(API_BASE_URL);
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(data?.message || 'Gagal mengambil berita.');
    }

    return data?.data || [];
  },

  /**
   * Ambil detail berita. Mengembalikan null bila berita tidak ditemukan.
   * @param {string} id
   */
  async getNewsDetail(id) {
    const response = await fetch(`${API_BASE_URL}/${encodeURIComponent(id)}`);

    if (response.status === 404) {
      return null;
    }

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(data?.error || data?.message || `HTTP Error ${response.status}`);
    }

    return data?.data || null;
  },
};

/**
 * Waktu relatif dari tanggal terbit, contoh: "2 jam lalu"
 */
export function formatRelativeTime(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return '';

  const diffMinutes = Math.floor((Date.now() - date.getTime()) / 60000);
  if (diffMinutes < 1) return 'Baru saja';
  if (diffMinutes < 60) return `${diffMinutes} menit lalu`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} jam lalu`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays} hari lalu`;
  return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
}
