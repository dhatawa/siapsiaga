const API_BASE_URL = 'http://localhost:5000/api/contents';

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

export const contentService = {
  /**
   * Mengambil semua konten untuk panel Admin (termasuk draft & statistik)
   * @param {object} params { search, type, category, status }
   */
  async getAdminContents({ search = '', type = '', category = '', status = '' } = {}) {
    const queryParams = new URLSearchParams();
    if (search) queryParams.append('search', search);
    if (type && type !== 'Semua Konten' && type !== 'Semua' && type !== 'all') {
      // Map UI tab nama ke 'artikel' atau 'video'
      const mappedType = type === 'Panduan Edukasi' ? 'artikel' : type === 'Koleksi Video' ? 'video' : type;
      queryParams.append('type', mappedType);
    }
    if (category && category !== 'Semua Kategori' && category !== 'Semua' && category !== 'all') {
      queryParams.append('category', category);
    }
    if (status && status !== 'Semua Status' && status !== 'all') {
      queryParams.append('status', status.toLowerCase());
    }

    const url = `${API_BASE_URL}/admin/all?${queryParams.toString()}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Gagal mengambil data konten admin.');
    }
    return {
      items: data.data || [],
      stats: data.stats || { total: 0, distribusikan: 0, draft: 0, artikel: 0, video: 0 }
    };
  },

  /**
   * Mengambil daftar konten terdistribusi untuk halaman publik
   * @param {object} params { search, type, category }
   */
  async getPublicContents({ search = '', type = '', category = '' } = {}) {
    const queryParams = new URLSearchParams();
    if (search) queryParams.append('search', search);
    if (type && type !== 'Semua' && type !== 'all') {
      const mappedType = type === 'Panduan Edukasi' || type === 'article' ? 'artikel' : type;
      queryParams.append('type', mappedType);
    }
    if (category && category !== 'Semua' && category !== 'all') {
      queryParams.append('category', category);
    }

    const url = `${API_BASE_URL}?${queryParams.toString()}`;
    const response = await fetch(url, {
      method: 'GET',
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Gagal mengambil data edukasi publik.');
    }
    return data.data || [];
  },

  /**
   * Mengambil detail konten publik berdasarkan slug
   * @param {string} slug 
   */
  async getContentBySlug(slug) {
    const response = await fetch(`${API_BASE_URL}/slug/${slug}`, {
      method: 'GET',
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Gagal memuat detail panduan edukasi.');
    }
    return data.data;
  },

  /**
   * Mengambil detail konten berdasarkan ID
   * @param {number|string} id 
   */
  async getContentById(id) {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Gagal memuat detail konten.');
    }
    return data.data;
  },

  /**
   * Membuat konten baru (Admin)
   * @param {FormData|object} formDataOrObj 
   */
  async createContent(formDataOrObj) {
    const isFormData = formDataOrObj instanceof FormData;
    const body = isFormData ? formDataOrObj : JSON.stringify(formDataOrObj);

    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: getAuthHeaders(isFormData),
      body: body,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Gagal membuat konten baru.');
    }
    return data;
  },

  /**
   * Memperbarui konten (Admin)
   * @param {number|string} id 
   * @param {FormData|object} formDataOrObj 
   */
  async updateContent(id, formDataOrObj) {
    const isFormData = formDataOrObj instanceof FormData;
    const body = isFormData ? formDataOrObj : JSON.stringify(formDataOrObj);

    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(isFormData),
      body: body,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Gagal memperbarui konten.');
    }
    return data;
  },

  /**
   * Mengubah status konten (draft <-> distribusikan)
   * @param {number|string} id 
   * @param {string|null} newStatus 
   */
  async toggleStatus(id, newStatus = null) {
    const response = await fetch(`${API_BASE_URL}/${id}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status: newStatus }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Gagal mengubah status konten.');
    }
    return data;
  },

  /**
   * Menghapus konten secara permanen
   * @param {number|string} id 
   */
  async deleteContent(id) {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Gagal menghapus konten.');
    }
    return data;
  },
};
