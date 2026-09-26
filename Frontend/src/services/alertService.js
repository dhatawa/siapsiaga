const API_BASE_URL = 'http://localhost:5000/api/alerts';

function getAuthHeaders() {
  const token = localStorage.getItem('siapsiaga_token');
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token || ''}`,
  };
}

export const alertService = {
  /**
   * Mengirimkan siaran peringatan darurat baru (Admin)
   * @param {object} param0 { level, message, target_areas }
   */
  async createAlert({ level = 'bahaya', message, target_areas = ['Semua Wilayah'] }) {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        level,
        message,
        target_areas
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Gagal mengirimkan siaran peringatan darurat.');
    }
    return data;
  },

  /**
   * Mengambil semua riwayat siaran peringatan (Admin)
   */
  async getAllAlerts() {
    const response = await fetch(API_BASE_URL, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Gagal mengambil riwayat peringatan.');
    }
    return data.data || [];
  },

  /**
   * Mengambil siaran peringatan aktif terbaru (Pengguna / Publik)
   * @param {number} limit 
   */
  async getRecentAlerts(limit = 10) {
    const response = await fetch(`${API_BASE_URL}/recent?limit=${limit}`, {
      method: 'GET',
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Gagal memuat data peringatan terbaru.');
    }
    return data.data || [];
  },

  /**
   * Menghapus siaran peringatan (Admin)
   * @param {number|string} id 
   */
  async deleteAlert(id) {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Gagal menghapus peringatan.');
    }
    return data;
  },
};
