import { useState, useEffect, useRef } from 'react';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Edit2,
  Trash2,
  UserCheck,
  UserX,
  Camera,
  X,
  Loader2,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import Swal from 'sweetalert2';
import { userService } from '../../services/userService';

const PAGE_SIZE = 5;

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & Filter State
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua Status');
  const [page, setPage] = useState(1);

  // Action Dropdown State
  const [openMenuId, setOpenMenuId] = useState(null);

  // Edit Modal State
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    status: 'aktif',
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);

  // Fetch Users from MySQL
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await userService.getUsers({
        search: query,
        status: statusFilter,
      });
      setUsers(data);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Gagal memuat data pengguna.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [statusFilter]);

  // Handle Search on Submit or Debounce
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setOpenMenuId(null);
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  // Filter client-side if needed or use search response
  const filtered = users.filter((u) => {
    const matchName = u.name.toLowerCase().includes(query.toLowerCase());
    const matchEmail = u.email.toLowerCase().includes(query.toLowerCase());
    const matchStatus =
      statusFilter === 'Semua Status' ||
      u.status.toLowerCase() === statusFilter.toLowerCase();
    return (matchName || matchEmail) && matchStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // 1. Action: Buka Modal Edit
  const handleOpenEdit = (u, e) => {
    e?.stopPropagation();
    setOpenMenuId(null);
    setEditingUser(u);
    setEditForm({
      name: u.name,
      email: u.email,
      status: u.status,
    });
    setSelectedFile(null);
    setPreviewUrl(u.avatar_url || '');
    setEditModalOpen(true);
  };

  // 2. Action: Pilih File Foto
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        Swal.fire({
          icon: 'error',
          title: 'Format Tidak Valid',
          text: 'Harap pilih file gambar (JPG, PNG, WEBP).',
        });
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // 3. Action: Submit Simpan Edit
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingUser) return;

    if (!editForm.name.trim() || !editForm.email.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Form Belum Lengkap',
        text: 'Nama dan email wajib diisi.',
      });
      return;
    }

    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('name', editForm.name.trim());
      formData.append('email', editForm.email.trim());
      formData.append('status', editForm.status);
      if (selectedFile) {
        formData.append('avatar', selectedFile);
      }

      await userService.updateUser(editingUser.id, formData);

      await Swal.fire({
        icon: 'success',
        title: 'Berhasil Diperbarui',
        text: 'Data pengguna dan foto profil berhasil disimpan.',
        timer: 1500,
        showConfirmButton: false,
      });

      setEditModalOpen(false);
      fetchUsers();
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal Memperbarui',
        text: err.message || 'Terjadi kesalahan pada server.',
      });
    } finally {
      setSaving(false);
    }
  };

  // 4. Action: Toggle Nonaktifkan / Aktifkan
  const handleToggleStatus = async (u, e) => {
    e?.stopPropagation();
    setOpenMenuId(null);

    const isCurrentActive = u.status === 'aktif';
    const actionText = isCurrentActive ? 'Nonaktifkan' : 'Aktifkan';
    const nextStatus = isCurrentActive ? 'tidak_aktif' : 'aktif';

    const result = await Swal.fire({
      title: `${actionText} Pengguna?`,
      text: isCurrentActive
        ? `Pengguna ${u.name} tidak akan dapat login ke sistem.`
        : `Pengguna ${u.name} akan dapat kembali login ke sistem.`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: isCurrentActive ? '#d97706' : '#16a34a',
      cancelButtonColor: '#6b7280',
      confirmButtonText: `Ya, ${actionText}!`,
      cancelButtonText: 'Batal',
    });

    if (result.isConfirmed) {
      try {
        await userService.toggleStatus(u.id, nextStatus);
        Swal.fire({
          icon: 'success',
          title: 'Status Berhasil Diubah',
          text: `Status ${u.name} sekarang ${nextStatus}.`,
          timer: 1500,
          showConfirmButton: false,
        });
        fetchUsers();
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Gagal Mengubah Status',
          text: err.message,
        });
      }
    }
  };

  // 5. Action: Hapus Pengguna
  const handleDeleteUser = async (u, e) => {
    e?.stopPropagation();
    setOpenMenuId(null);

    const result = await Swal.fire({
      title: 'Hapus Pengguna?',
      text: `Akun ${u.name} (${u.email}) akan dihapus permanen dari basis data!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Ya, Hapus Permanen!',
      cancelButtonText: 'Batal',
    });

    if (result.isConfirmed) {
      try {
        await userService.deleteUser(u.id);
        Swal.fire({
          icon: 'success',
          title: 'Pengguna Dihapus',
          text: `Pengguna ${u.name} berhasil dihapus.`,
          timer: 1500,
          showConfirmButton: false,
        });
        fetchUsers();
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Gagal Menghapus',
          text: err.message,
        });
      }
    }
  };

  return (
    <div>
      {/* Header Halaman */}
      <div className="flex items-start justify-between flex-wrap gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manajemen Pengguna</h1>
          <p className="text-sm text-gray-500 mt-1">
            Kelola pengguna terdaftar dari basis data MySQL, perbarui profil, upload foto, dan pantau status akun.
          </p>
        </div>
        <button
          onClick={fetchUsers}
          className="flex items-center gap-1.5 text-xs font-medium bg-white border border-gray-200 px-3.5 py-2 rounded-lg text-gray-700 hover:bg-gray-50 shadow-sm transition"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Muat Ulang
        </button>
      </div>

      {/* Tabel & Filter Container */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Bar Pencarian & Filter Status */}
        <div className="flex items-center justify-between gap-3 p-4 border-b border-gray-100 flex-wrap">
          <form onSubmit={handleSearchSubmit} className="relative flex-1 min-w-[240px] max-w-md">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Cari berdasarkan nama atau email..."
              className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-xs outline-none focus:ring-2 focus:ring-primary-700/20"
            />
          </form>

          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="text-xs border border-gray-200 rounded-lg px-3 py-2 text-gray-600 outline-none focus:ring-2 focus:ring-primary-700/20 bg-white"
            >
              <option value="Semua Status">Semua Status</option>
              <option value="aktif">Aktif</option>
              <option value="tidak_aktif">Tidak Aktif</option>
            </select>
          </div>
        </div>

        {/* Status Loading & Error */}
        {loading ? (
          <div className="py-16 text-center">
            <Loader2 size={32} className="animate-spin text-brand-red mx-auto" />
            <p className="text-sm text-gray-500 mt-3 font-medium">Memuat data pengguna dari database...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <AlertCircle size={36} className="text-red-500 mx-auto" />
            <p className="text-sm font-semibold text-gray-800 mt-2">Terjadi Kesalahan</p>
            <p className="text-xs text-gray-500 mt-1">{error}</p>
            <button
              onClick={fetchUsers}
              className="mt-4 px-4 py-2 bg-brand-red text-white text-xs font-medium rounded-lg hover:bg-red-700"
            >
              Coba Lagi
            </button>
          </div>
        ) : paginated.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-gray-400 text-sm font-medium">Tidak ada data pengguna ditemukan.</p>
            {query && (
              <button
                onClick={() => {
                  setQuery('');
                  setStatusFilter('Semua Status');
                }}
                className="mt-2 text-xs text-primary-700 font-medium hover:underline"
              >
                Reset Pencarian
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] text-gray-400 uppercase tracking-wide border-b border-gray-100 bg-gray-50/50">
                  <th className="px-4 py-3 font-medium">Nama Pengguna</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Terdaftar</th>
                  <th className="px-4 py-3 font-medium text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {paginated.map((u) => {
                  const initial = u.name ? u.name.charAt(0).toUpperCase() : 'U';
                  const isAktif = u.status === 'aktif';
                  const isMenuOpen = openMenuId === u.id;

                  return (
                    <tr key={u.id} className="hover:bg-gray-50/60 transition">
                      {/* Avatar & Nama */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-primary-700 text-white text-xs font-bold flex items-center justify-center shrink-0 overflow-hidden shadow-sm">
                            {u.avatar_url ? (
                              <img
                                src={u.avatar_url}
                                alt={u.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                }}
                              />
                            ) : (
                              initial
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800 text-xs">{u.name}</p>
                            <span className="text-[10px] text-gray-400">ID #{u.id}</span>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="px-4 py-3.5 text-xs text-gray-600">
                        {u.email}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5">
                        <span
                          className={`text-[11px] font-medium px-2.5 py-1 rounded-full ${
                            isAktif
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-red-50 text-red-700 border border-red-200'
                          }`}
                        >
                          {isAktif ? 'Aktif' : 'Tidak Aktif'}
                        </span>
                      </td>

                      {/* Tanggal Terdaftar */}
                      <td className="px-4 py-3.5 text-xs text-gray-400">
                        {u.created_at
                          ? new Date(u.created_at).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })
                          : '-'}
                      </td>

                      {/* Aksi Menu Dropdown */}
                      <td className="px-4 py-3.5 text-right relative">
                        <div className="relative inline-block text-left">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenMenuId(isMenuOpen ? null : u.id);
                            }}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
                            title="Menu Aksi"
                          >
                            <MoreVertical size={16} />
                          </button>

                          {isMenuOpen && (
                            <div
                              onClick={(e) => e.stopPropagation()}
                              className="absolute right-0 top-8 w-44 bg-white rounded-xl shadow-xl border border-gray-100 z-30 py-1 text-xs animate-in fade-in zoom-in-95 duration-100"
                            >
                              {/* Edit */}
                              <button
                                onClick={(e) => handleOpenEdit(u, e)}
                                className="w-full px-3.5 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2.5 transition"
                              >
                                <Edit2 size={14} className="text-blue-500" />
                                Edit Pengguna
                              </button>

                              {/* Toggle Status */}
                              <button
                                onClick={(e) => handleToggleStatus(u, e)}
                                className="w-full px-3.5 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2.5 transition"
                              >
                                {isAktif ? (
                                  <>
                                    <UserX size={14} className="text-amber-500" />
                                    Nonaktifkan
                                  </>
                                ) : (
                                  <>
                                    <UserCheck size={14} className="text-emerald-500" />
                                    Aktifkan
                                  </>
                                )}
                              </button>

                              {/* Hapus */}
                              <div className="border-t border-gray-100 my-1" />
                              <button
                                onClick={(e) => handleDeleteUser(u, e)}
                                className="w-full px-3.5 py-2 text-left text-red-600 hover:bg-red-50 flex items-center gap-2.5 transition font-medium"
                              >
                                <Trash2 size={14} className="text-red-500" />
                                Hapus Pengguna
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        {!loading && filtered.length > 0 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 text-xs text-gray-400">
            <span>
              Menampilkan {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)} sampai{' '}
              {Math.min(page * PAGE_SIZE, filtered.length)} dari {filtered.length} pengguna
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-7 h-7 rounded-md border border-gray-200 flex items-center justify-center disabled:opacity-40 hover:bg-gray-50 transition"
              >
                <ChevronLeft size={13} />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-7 h-7 rounded-md text-xs font-medium transition ${
                    p === page
                      ? 'bg-brand-red text-white'
                      : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {p}
                </button>
              ))}

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="w-7 h-7 rounded-md border border-gray-200 flex items-center justify-center disabled:opacity-40 hover:bg-gray-50 transition"
              >
                <ChevronRight size={13} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* MODAL EDIT PENGGUNA */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Header Modal */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-base font-bold text-gray-900">Edit Pengguna</h3>
              <button
                onClick={() => setEditModalOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form Modal */}
            <form onSubmit={handleSaveEdit} className="p-6 space-y-4">
              {/* Foto Profil & Upload Preview */}
              <div className="flex flex-col items-center gap-3">
                <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                  <div className="w-20 h-20 rounded-full bg-gray-100 border-2 border-primary-100 overflow-hidden shadow-inner flex items-center justify-center">
                    {previewUrl ? (
                      <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xl font-bold text-gray-400">
                        {editForm.name ? editForm.name.charAt(0).toUpperCase() : 'U'}
                      </span>
                    )}
                  </div>
                  <div className="absolute inset-0 bg-black/40 rounded-full flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition">
                    <Camera size={18} />
                    <span className="text-[10px] mt-0.5">Ubah Foto</span>
                  </div>
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs text-primary-700 font-semibold hover:underline"
                >
                  Upload Foto Baru
                </button>
              </div>

              {/* Nama Lengkap */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  placeholder="Masukkan nama pengguna"
                  className="w-full border border-gray-200 rounded-lg px-3.5 py-2 text-xs outline-none focus:ring-2 focus:ring-primary-700/20"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Alamat Email</label>
                <input
                  type="email"
                  required
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  placeholder="nama@email.com"
                  className="w-full border border-gray-200 rounded-lg px-3.5 py-2 text-xs outline-none focus:ring-2 focus:ring-primary-700/20"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Status Akun</label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3.5 py-2 text-xs outline-none focus:ring-2 focus:ring-primary-700/20 bg-white"
                >
                  <option value="aktif">Aktif</option>
                  <option value="tidak_aktif">Tidak Aktif</option>
                </select>
              </div>

              {/* Tombol Aksi Modal */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => setEditModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 text-xs font-semibold text-white bg-brand-red hover:bg-red-700 rounded-lg transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  {saving ? (
                    <>
                      <Loader2 size={14} className="animate-spin" /> Menyimpan...
                    </>
                  ) : (
                    'Simpan Perubahan'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
