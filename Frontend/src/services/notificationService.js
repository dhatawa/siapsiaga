const API_BASE_URL = 'http://localhost:5000/api/notifications';

export const notificationService = {
  /**
   * Mengambil daftar notifikasi terpadu (Peringatan Admin, Laporan Insiden, Berita Eksternal, Edukasi Baru)
   * @param {number} limit 
   */
  async getNotifications(limit = 35) {
    const response = await fetch(`${API_BASE_URL}?limit=${limit}`, {
      method: 'GET',
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Gagal memuat notifikasi.');
    }
    return data.data || [];
  },

  /**
   * Menandai semua notifikasi sebagai telah dibaca
   */
  async markAllRead() {
    try {
      localStorage.setItem('siapsiaga_last_read_notif', Date.now().toString());
      const response = await fetch(`${API_BASE_URL}/read-all`, {
        method: 'POST',
      });
      return await response.json();
    } catch (err) {
      console.warn('Mark read error:', err);
    }
  },

  /**
   * Menghitung notifikasi unread berdasarkan timestamp terakhir dibaca
   * @param {Array} notifications 
   */
  getUnreadCount(notifications = []) {
    try {
      const lastRead = parseInt(localStorage.getItem('siapsiaga_last_read_notif') || '0', 10);
      if (!lastRead) return Math.min(notifications.length, 9);
      const unread = notifications.filter((n) => (n.timestamp || 0) > lastRead);
      return unread.length;
    } catch {
      return 0;
    }
  }
};
