const API_BASE_URL = 'http://localhost:5000/api/reports';

function getAuthHeaders(isFormData = false) {
  const token = localStorage.getItem('siapsiaga_token');
  const headers = {
    Authorization: `Bearer ${token || ''}`,
  };
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }
  return headers;
}

export const reportService = {
  /**
   * Mengirim laporan insiden baru dari pengguna
   * @param {FormData|object} formDataOrObj 
   */
  async createReport(formDataOrObj) {
    const isFormData = formDataOrObj instanceof FormData;
    const body = isFormData ? formDataOrObj : JSON.stringify(formDataOrObj);

    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: getAuthHeaders(isFormData),
      body: body,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Gagal mengirim laporan bencana.');
    }
    return data;
  },

  /**
   * Mengambil semua laporan untuk Admin (dengan filter & counter)
   * @param {object} params { status, disaster_type, search }
   */
  async getAdminReports({ status = '', disaster_type = '', search = '' } = {}) {
    const queryParams = new URLSearchParams();
    if (status && status !== 'Semua Status' && status !== 'all') {
      queryParams.append('status', status.toLowerCase());
    }
    if (disaster_type && disaster_type !== 'Semua Jenis' && disaster_type !== 'all') {
      queryParams.append('disaster_type', disaster_type.toLowerCase());
    }
    if (search) {
      queryParams.append('search', search);
    }

    const url = `${API_BASE_URL}/admin/all?${queryParams.toString()}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Gagal mengambil data laporan insiden.');
    }
    return {
      items: data.data || [],
      stats: data.stats || { total: 0, menunggu: 0, divalidasi: 0, ditolak: 0 }
    };
  },

  /**
   * Mengambil daftar laporan berstatus 'divalidasi' untuk publik
   * @param {object} params { disaster_type, search }
   */
  async getPublicReports({ disaster_type = '', search = '' } = {}) {
    const queryParams = new URLSearchParams();
    if (disaster_type && disaster_type !== 'Semua' && disaster_type !== 'all') {
      queryParams.append('disaster_type', disaster_type.toLowerCase());
    }
    if (search) {
      queryParams.append('search', search);
    }

    const url = `${API_BASE_URL}/public?${queryParams.toString()}`;
    const response = await fetch(url, {
      method: 'GET',
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Gagal mengambil data laporan terverifikasi.');
    }
    return data.data || [];
  },

  /**
   * Mengambil riwayat laporan pengguna yang sedang login
   */
  async getMyReports() {
    const response = await fetch(`${API_BASE_URL}/my`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Gagal mengambil riwayat laporan Anda.');
    }
    return data.data || [];
  },

  /**
   * Mengambil detail laporan berdasarkan ID
   * @param {number|string} id 
   */
  async getReportById(id) {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Gagal mengambil detail laporan.');
    }
    return data.data;
  },

  /**
   * Mengubah status validasi laporan (Approve / Reject)
   * @param {number|string} id 
   * @param {'divalidasi'|'ditolak'|'menunggu'} status 
   */
  async validateReport(id, status) {
    const response = await fetch(`${API_BASE_URL}/${id}/validate`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Gagal memperbarui status laporan.');
    }
    return data;
  },

  /**
   * Menghapus laporan
   * @param {number|string} id 
   */
  async deleteReport(id) {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Gagal menghapus laporan.');
    }
    return data;
  },
};
