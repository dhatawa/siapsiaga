const API_BASE_URL = 'http://localhost:5000/api/users';

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

export const userService = {
  /**
   * Mengambil daftar user biasa (role 'user' saja) dari database MySQL
   * @param {object} params { search, status }
   */
  async getUsers({ search = '', status = '' } = {}) {
    const queryParams = new URLSearchParams();
    if (search) queryParams.append('search', search);
    if (status && status !== 'Semua Status' && status !== 'all') {
      queryParams.append('status', status);
    }

    const url = `${API_BASE_URL}?${queryParams.toString()}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Gagal mengambil data pengguna.');
    }
    return data.data || [];
  },

  /**
   * Mengambil data detail user berdasarkan ID
   */
  async getUserById(id) {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Gagal mengambil detail pengguna.');
    }
    return data.data;
  },

  /**
   * Update data user (Nama, Email, Status, dan Foto Avatar)
   * Mendukung upload file foto via FormData
   */
  async updateUser(id, formDataOrObj) {
    const isFormData = formDataOrObj instanceof FormData;
    const body = isFormData ? formDataOrObj : JSON.stringify(formDataOrObj);

    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(isFormData),
      body: body,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Gagal memperbarui data pengguna.');
    }
    return data;
  },

  /**
   * Mengubah status pengguna (aktif / tidak_aktif)
   */
  async toggleStatus(id, newStatus) {
    const response = await fetch(`${API_BASE_URL}/${id}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status: newStatus }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Gagal mengubah status pengguna.');
    }
    return data;
  },

  /**
   * Menghapus pengguna
   */
  async deleteUser(id) {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Gagal menghapus pengguna.');
    }
    return data;
  },
};
