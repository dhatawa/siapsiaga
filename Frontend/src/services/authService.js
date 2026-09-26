const API_BASE_URL = 'http://localhost:5000/api/auth';

export const authService = {
  /**
   * Registrasi User Baru
   * @param {object} param0 { name, email, password, confirmPassword }
   */
  async register({ name, email, password, confirmPassword }) {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        password,
        confirmPassword,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Gagal melakukan registrasi.');
    }

    return data;
  },

  /**
   * Login Pengguna
   * @param {string} email 
   * @param {string} password 
   */
  async login(email, password) {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Gagal masuk. Periksa email dan kata sandi Anda.');
    }

    return data;
  },

  /**
   * Mengambil Profil Pengguna yang Sedang Login
   * @param {string} token 
   */
  async getMe(token) {
    const response = await fetch(`${API_BASE_URL}/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Sesi telah kadaluarsa.');
    }

    return data;
  },

  /**
   * Mengubah Kata Sandi Pengguna
   * @param {object} param0 { currentPassword, newPassword, confirmPassword }
   */
  async changePassword({ currentPassword, newPassword, confirmPassword }) {
    const token = localStorage.getItem('siapsiaga_token');
    const response = await fetch(`${API_BASE_URL}/change-password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token || ''}`,
      },
      body: JSON.stringify({
        currentPassword,
        newPassword,
        confirmPassword,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Gagal mengubah kata sandi.');
    }

    return data;
  },

  /**
   * Simpan Token dan Data User ke LocalStorage
   */
  saveAuth(authData) {
    if (authData?.token) {
      localStorage.setItem('siapsiaga_token', authData.token);
    }
    if (authData?.user) {
      localStorage.setItem('siapsiaga_user', JSON.stringify(authData.user));
    }
  },

  /**
   * Ambil Token dan Data User dari LocalStorage
   */
  getStoredAuth() {
    try {
      const token = localStorage.getItem('siapsiaga_token');
      const userStr = localStorage.getItem('siapsiaga_user');
      const user = userStr ? JSON.parse(userStr) : null;
      return { token, user };
    } catch {
      return { token: null, user: null };
    }
  },

  /**
   * Hapus Data Auth dari LocalStorage
   */
  clearAuth() {
    localStorage.removeItem('siapsiaga_token');
    localStorage.removeItem('siapsiaga_user');
  },
};
