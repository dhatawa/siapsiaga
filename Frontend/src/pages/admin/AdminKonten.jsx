import { useState, useEffect, useRef } from 'react';
import {
  Plus,
  Pencil,
  Trash2,
  ChevronDown,
  Play,
  FileText,
  Search,
  RefreshCw,
  Loader2,
  X,
  Upload,
  Image as ImageIcon,
  Video as VideoIcon,
  Globe,
  Eye,
  CheckCircle2,
  FileClock,
  Sparkles,
  Link as LinkIcon,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import Swal from 'sweetalert2';
import { contentService } from '../../services/contentService';

const CATEGORY_OPTIONS = [
  'Gempa Bumi',
  'Tsunami',
  'Banjir',
  'Kebakaran',
  'Cuaca Ekstrem',
  'Evakuasi Darurat',
  'P3K & Logistik',
  'Mitigasi Bencana',
  'Umum'
];

export default function AdminKonten() {
  const [contents, setContents] = useState([]);
  const [stats, setStats] = useState({ total: 0, distribusikan: 0, draft: 0, artikel: 0, video: 0 });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Filter States
  const [activeTab, setActiveTab] = useState('Semua Konten');
  const [statusFilter, setStatusFilter] = useState('Semua Status');
  const [categoryFilter, setCategoryFilter] = useState('Semua Kategori');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    type: 'artikel', // 'artikel' | 'video'
    category: 'Gempa Bumi',
    body: '',
    video_source_type: 'url', // 'file' | 'url'
    video_url: '',
    status: 'draft' // 'draft' | 'distribusikan'
  });

  // Media Upload State
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState('');
  const [existingVideoUrl, setExistingVideoUrl] = useState('');

  const thumbInputRef = useRef(null);
  const videoInputRef = useRef(null);

  // Preview Public Modal State
  const [previewItem, setPreviewItem] = useState(null);

  // Fetch Data from MySQL
  const fetchContents = async () => {
    try {
      setLoading(true);
      const res = await contentService.getAdminContents({
        search: searchQuery,
        type: activeTab,
        category: categoryFilter,
        status: statusFilter
      });
      setContents(res.items || []);
      setStats(res.stats || { total: 0, distribusikan: 0, draft: 0, artikel: 0, video: 0 });
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Gagal Memuat Data',
        text: err.message || 'Terjadi kesalahan saat memuat data konten.',
        confirmButtonColor: '#C81E2C'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContents();
  }, [activeTab, statusFilter, categoryFilter]);

  // Handle Search Submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchContents();
  };

  // Reset & Open Create Modal
  const handleOpenCreate = (prefilledType = 'artikel') => {
    setIsEditing(false);
    setEditingId(null);
    setFormData({
      title: '',
      slug: '',
      type: prefilledType,
      category: 'Gempa Bumi',
      body: '',
      video_source_type: 'url',
      video_url: '',
      status: 'draft'
    });
    setThumbnailFile(null);
    setThumbnailPreview('');
    setVideoFile(null);
    setVideoPreview('');
    setExistingVideoUrl('');
    setModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (item, e) => {
    e?.stopPropagation();
    setIsEditing(true);
    setEditingId(item.id);

    const isVideoLocal = item.video_url && item.video_url.includes('/uploads/videos/');

    setFormData({
      title: item.title || '',
      slug: item.slug || '',
      type: item.type || 'artikel',
      category: item.category || 'Umum',
      body: item.body || '',
      video_source_type: isVideoLocal ? 'file' : 'url',
      video_url: isVideoLocal ? '' : (item.video_url || ''),
      status: item.status || 'draft'
    });

    setThumbnailFile(null);
    setThumbnailPreview(item.thumbnail_url || '');
    setVideoFile(null);
    setVideoPreview('');
    setExistingVideoUrl(item.video_url || '');
    setModalOpen(true);
  };

  // Handle Title Change & Auto Slug
  const handleTitleChange = (e) => {
    const val = e.target.value;
    const generatedSlug = val
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

    setFormData((prev) => ({
      ...prev,
      title: val,
      slug: isEditing ? prev.slug : generatedSlug
    }));
  };

  // Handle Thumbnail File
  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        Swal.fire({
          icon: 'error',
          title: 'Format Tidak Didukung',
          text: 'Silakan pilih file gambar (JPG, PNG, WEBP).',
          confirmButtonColor: '#C81E2C'
        });
        return;
      }
      setThumbnailFile(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  // Handle Video File
  const handleVideoFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('video/')) {
        Swal.fire({
          icon: 'error',
          title: 'Format Tidak Didukung',
          text: 'Silakan pilih file video (MP4, WebM, MKV).',
          confirmButtonColor: '#C81E2C'
        });
        return;
      }
      if (file.size > 100 * 1024 * 1024) {
        Swal.fire({
          icon: 'warning',
          title: 'Ukuran Terlalu Besar',
          text: 'Ukuran maksimal file video adalah 100MB.',
          confirmButtonColor: '#C81E2C'
        });
        return;
      }
      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));
    }
  };

  // Submit Create or Update
  const handleSubmitForm = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Data Belum Lengkap',
        text: 'Judul konten wajib diisi.',
        confirmButtonColor: '#C81E2C'
      });
      return;
    }

    if (formData.type === 'video' && formData.video_source_type === 'url' && !formData.video_url.trim() && !existingVideoUrl) {
      Swal.fire({
        icon: 'warning',
        title: 'Video Belum Ditentukan',
        text: 'Silakan masukkan tautan video atau unggah file video.',
        confirmButtonColor: '#C81E2C'
      });
      return;
    }

    try {
      setSaving(true);

      const payload = new FormData();
      payload.append('title', formData.title.trim());
      payload.append('slug', formData.slug.trim());
      payload.append('type', formData.type);
      payload.append('category', formData.category);
      payload.append('body', formData.body || '');
      payload.append('status', formData.status);

      if (formData.type === 'video') {
        if (formData.video_source_type === 'url' && formData.video_url) {
          payload.append('video_url', formData.video_url.trim());
        }
        if (videoFile) {
          payload.append('video', videoFile);
        }
      }

      if (thumbnailFile) {
        payload.append('thumbnail', thumbnailFile);
      }

      if (isEditing) {
        await contentService.updateContent(editingId, payload);
        Swal.fire({
          icon: 'success',
          title: 'Berhasil Diperbarui',
          text: 'Data konten berhasil disimpan.',
          timer: 1800,
          showConfirmButton: false
        });
      } else {
        await contentService.createContent(payload);
        Swal.fire({
          icon: 'success',
          title: 'Berhasil Dibuat',
          text: `Konten berhasil disimpan sebagai ${formData.status === 'distribusikan' ? 'Terdistribusi' : 'Draf'}.`,
          timer: 1800,
          showConfirmButton: false
        });
      }

      setModalOpen(false);
      fetchContents();
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Gagal Menyimpan',
        text: err.message || 'Terjadi kesalahan saat menyimpan data konten.',
        confirmButtonColor: '#C81E2C'
      });
    } finally {
      setSaving(false);
    }
  };

  // Toggle Status Action
  const handleToggleStatus = async (item, e) => {
    e?.stopPropagation();
    const newStatus = item.status === 'distribusikan' ? 'draft' : 'distribusikan';
    const actionText = newStatus === 'distribusikan' ? 'Distribusikan ke Publik' : 'Tarik Menjadi Draf';

    const result = await Swal.fire({
      title: `${actionText}?`,
      text:
        newStatus === 'distribusikan'
          ? 'Konten ini akan langsung tampil di halaman Edukasi publik.'
          : 'Konten akan disembunyikan dari publik dan hanya terlihat oleh Admin.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: newStatus === 'distribusikan' ? '#059669' : '#4B5563',
      cancelButtonColor: '#9CA3AF',
      confirmButtonText: `Ya, ${actionText}`,
      cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
      try {
        await contentService.toggleStatus(item.id, newStatus);
        Swal.fire({
          icon: 'success',
          title: 'Status Berhasil Diubah',
          text: `Status konten sekarang adalah "${newStatus}".`,
          timer: 1500,
          showConfirmButton: false
        });
        fetchContents();
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Gagal Mengubah Status',
          text: err.message || 'Terjadi kesalahan.',
          confirmButtonColor: '#C81E2C'
        });
      }
    }
  };

  // Delete Action
  const handleDeleteContent = async (item, e) => {
    e?.stopPropagation();
    const result = await Swal.fire({
      title: 'Hapus Konten Ini?',
      text: `Konten "${item.title}" akan dihapus permanen beserta medianya.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#C81E2C',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Ya, Hapus Permanen',
      cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
      try {
        await contentService.deleteContent(item.id);
        Swal.fire({
          icon: 'success',
          title: 'Terhapus!',
          text: 'Konten berhasil dihapus.',
          timer: 1500,
          showConfirmButton: false
        });
        fetchContents();
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Gagal Menghapus',
          text: err.message || 'Terjadi kesalahan saat menghapus data.',
          confirmButtonColor: '#C81E2C'
        });
      }
    }
  };

  // Helpers for category badge color
  const getCategoryBadgeClass = (category) => {
    switch (category) {
      case 'Gempa Bumi':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'Tsunami':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Banjir':
        return 'bg-cyan-50 text-cyan-700 border-cyan-200';
      case 'Kebakaran':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'Cuaca Ekstrem':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getYoutubeEmbedUrl = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? `https://www.youtube.com/embed/${match[2]}` : null;
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header & Quick Actions */}
      <div className="flex items-start justify-between flex-wrap gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-red-50 text-brand-red">
              <Layers size={22} />
            </span>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Manajemen Konten</h1>
          </div>
          <p className="text-sm text-gray-500 mt-1.5 ml-10">
            Kelola panduan edukasi mitigasi dan sumber video tutorial untuk kesadaran publik.
          </p>
        </div>

        <div className="flex items-center gap-2.5 ml-10 sm:ml-0">
          <button
            onClick={fetchContents}
            disabled={loading}
            className="p-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
            title="Muat Ulang"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin text-brand-red' : ''} />
          </button>

          <button
            onClick={() => handleOpenCreate('artikel')}
            className="flex items-center gap-2 text-sm font-semibold bg-brand-red hover:bg-red-700 text-white px-4 py-2.5 rounded-xl shadow-sm transition-all duration-200 hover:shadow"
          >
            <Plus size={17} /> Buat Konten Baru
          </button>
        </div>
      </div>

      {/* 2. Statistics Counter Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-5 gap-3.5">
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-700 font-bold">
            <Layers size={18} />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium">Total Konten</p>
            <p className="text-xl font-bold text-gray-900">{stats.total}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 size={18} />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium">Terdistribusi</p>
            <p className="text-xl font-bold text-emerald-600">{stats.distribusikan}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <FileClock size={18} />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium">Draf Disimpan</p>
            <p className="text-xl font-bold text-amber-600">{stats.draft}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-50 text-brand-red flex items-center justify-center font-bold">
            <FileText size={18} />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium">Panduan Teks</p>
            <p className="text-xl font-bold text-brand-red">{stats.artikel}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3 col-span-2 sm:col-span-1">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <VideoIcon size={18} />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium">Video Tutorial</p>
            <p className="text-xl font-bold text-indigo-600">{stats.video}</p>
          </div>
        </div>
      </div>

      {/* 3. Filter Tabs & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Type Tabs */}
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          {['Semua Konten', 'Panduan Edukasi', 'Koleksi Video'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-xs font-semibold px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
                activeTab === tab
                  ? 'bg-brand-red text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search & Dropdown Filters */}
        <div className="flex items-center flex-wrap sm:flex-nowrap gap-2.5 w-full md:w-auto">
          <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-56">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Cari judul konten..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red"
            />
          </form>

          {/* Status Filter */}
          <div className="relative w-1/2 sm:w-36">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-700 text-xs rounded-xl px-3 py-2 pr-7 font-medium focus:outline-none focus:ring-2 focus:ring-brand-red/20"
            >
              <option value="Semua Status">Semua Status</option>
              <option value="distribusikan">Terdistribusi</option>
              <option value="draft">Draf</option>
            </select>
            <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          {/* Category Filter */}
          <div className="relative w-1/2 sm:w-40">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-700 text-xs rounded-xl px-3 py-2 pr-7 font-medium focus:outline-none focus:ring-2 focus:ring-brand-red/20"
            >
              <option value="Semua Kategori">Semua Kategori</option>
              {CATEGORY_OPTIONS.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* 4. Content Cards Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100">
          <Loader2 className="w-8 h-8 text-brand-red animate-spin mb-3" />
          <p className="text-sm font-medium text-gray-500">Memuat data konten...</p>
        </div>
      ) : contents.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200 p-8">
          <div className="w-14 h-14 bg-red-50 text-brand-red rounded-2xl flex items-center justify-center mx-auto mb-3.5">
            <Layers size={26} />
          </div>
          <h3 className="text-base font-bold text-gray-900">Belum Ada Konten</h3>
          <p className="text-xs text-gray-500 max-w-md mx-auto mt-1 mb-5">
            {searchQuery || statusFilter !== 'Semua Status' || categoryFilter !== 'Semua Kategori'
              ? 'Tidak ada konten yang sesuai dengan filter pencarian Anda.'
              : 'Mulai buat panduan edukasi atau unggah video mitigasi pertama Anda untuk masyarakat.'}
          </p>
          <button
            onClick={() => handleOpenCreate('artikel')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold bg-brand-red text-white px-4 py-2.5 rounded-xl hover:bg-red-700 transition"
          >
            <Plus size={15} /> Tambah Konten Sekarang
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {contents.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col group"
            >
              {/* Media Thumbnail Container */}
              <div className="relative h-44 bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center overflow-hidden">
                {item.thumbnail_url ? (
                  <img
                    src={item.thumbnail_url}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                ) : item.type === 'video' ? (
                  <div className="flex flex-col items-center justify-center text-gray-300">
                    <span className="w-12 h-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white mb-1 shadow-lg">
                      <Play size={20} className="ml-1" />
                    </span>
                    <span className="text-[11px] font-medium text-white/80">Video Tutorial</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-gray-300">
                    <span className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white/70 mb-1">
                      <FileText size={22} />
                    </span>
                    <span className="text-[11px] font-medium text-white/70">Panduan Teks</span>
                  </div>
                )}

                {/* Status Badges Overlay */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
                  <span
                    className={`text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-lg uppercase shadow-sm ${
                      item.status === 'distribusikan'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-amber-500 text-white'
                    }`}
                  >
                    {item.status === 'distribusikan' ? 'DISTRIBUSIKAN' : 'DRAF'}
                  </span>

                  <span
                    className={`text-[10px] font-semibold px-2 py-1 rounded-lg shadow-sm ${
                      item.type === 'video'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-rose-600 text-white'
                    }`}
                  >
                    {item.type === 'video' ? 'Video' : 'Artikel'}
                  </span>
                </div>

                {/* Video Play Overlay for Video Type */}
                {item.type === 'video' && item.thumbnail_url && (
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <span className="w-10 h-10 rounded-full bg-white/90 shadow flex items-center justify-center text-gray-800 group-hover:scale-110 transition-transform">
                      <Play size={16} className="ml-0.5" />
                    </span>
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span
                      className={`text-[11px] font-medium px-2 py-0.5 rounded-md border ${getCategoryBadgeClass(
                        item.category
                      )}`}
                    >
                      {item.category}
                    </span>
                    <span className="text-[10px] text-gray-400">
                      {new Date(item.updated_at || item.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-gray-900 line-clamp-2 leading-snug hover:text-brand-red transition-colors">
                    {item.title}
                  </h3>

                  {item.body && (
                    <p className="text-xs text-gray-500 line-clamp-2 mt-1.5 leading-relaxed">
                      {item.body.replace(/[#*`_]/g, '')}
                    </p>
                  )}
                </div>

                {/* Card Footer Actions */}
                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                  {/* Toggle Status Button */}
                  <button
                    onClick={(e) => handleToggleStatus(item, e)}
                    className={`text-[11px] font-semibold px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1 ${
                      item.status === 'distribusikan'
                        ? 'bg-gray-100 text-gray-700 hover:bg-amber-50 hover:text-amber-700'
                        : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                    }`}
                    title={item.status === 'distribusikan' ? 'Tarik ke Draf' : 'Publikasikan Konten'}
                  >
                    {item.status === 'distribusikan' ? (
                      <>
                        <FileClock size={12} /> Jadikan Draf
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={12} /> Distribusikan
                      </>
                    )}
                  </button>

                  <div className="flex items-center gap-1">
                    {/* View Preview Button */}
                    <button
                      onClick={() => setPreviewItem(item)}
                      className="p-1.5 text-gray-500 hover:text-primary-700 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Lihat Pratinjau"
                    >
                      <Eye size={15} />
                    </button>

                    {/* Edit Button */}
                    <button
                      onClick={(e) => handleOpenEdit(item, e)}
                      className="p-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit Konten"
                    >
                      <Pencil size={15} />
                    </button>

                    {/* Delete Button */}
                    <button
                      onClick={(e) => handleDeleteContent(item, e)}
                      className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                      title="Hapus Konten"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Quick Create Card Button */}
          <button
            onClick={() => handleOpenCreate('artikel')}
            className="border-2 border-dashed border-gray-200 hover:border-brand-red/40 bg-gray-50/50 hover:bg-red-50/20 rounded-2xl flex flex-col items-center justify-center gap-2 p-8 text-gray-400 hover:text-brand-red transition-all min-h-[280px]"
          >
            <span className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-gray-500 group-hover:text-brand-red">
              <Plus size={22} />
            </span>
            <span className="text-sm font-bold text-gray-700 mt-1">Tambah Konten Baru</span>
            <span className="text-xs text-gray-400 text-center max-w-[200px]">
              Buat panduan edukasi keselamatan atau tutorial video mitigasi
            </span>
          </button>
        </div>
      )}

      {/* 5. Modal Form (Create / Edit Content) */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/70 rounded-t-2xl">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  {isEditing ? 'Edit Konten Edukasi' : 'Buat Konten Edukasi Baru'}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Isi informasi materi keselamatan untuk disebarkan kepada masyarakat.
                </p>
              </div>
              <button
                onClick={() => !saving && setModalOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-200/60 transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSubmitForm} className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* Type Selection */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">
                  Jenis Konten <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, type: 'artikel' }))}
                    className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-bold transition-all ${
                      formData.type === 'artikel'
                        ? 'border-brand-red bg-red-50/50 text-brand-red shadow-sm'
                        : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <FileText size={16} /> Panduan Teks / Artikel
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, type: 'video' }))}
                    className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-bold transition-all ${
                      formData.type === 'video'
                        ? 'border-indigo-600 bg-indigo-50/50 text-indigo-600 shadow-sm'
                        : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <VideoIcon size={16} /> Video Tutorial Mitigasi
                  </button>
                </div>
              </div>

              {/* Title & Slug */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Judul Konten <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Langkah Evakuasi Darurat Saat Gempa Bumi di Gedung Bertingkat"
                  value={formData.title}
                  onChange={handleTitleChange}
                  className="w-full text-xs rounded-xl border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red font-medium"
                />
                {formData.slug && (
                  <p className="text-[11px] text-gray-400 mt-1 flex items-center gap-1">
                    <span className="font-semibold text-gray-500">Slug URL:</span> /edukasi/{formData.slug}
                  </p>
                )}
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Kategori Bencana <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {CATEGORY_OPTIONS.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, category: cat }))}
                      className={`text-xs px-2.5 py-1 rounded-lg border transition-colors ${
                        formData.category === cat
                          ? 'bg-brand-red text-white border-brand-red font-semibold'
                          : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Atau ketik kategori kustom..."
                  value={formData.category}
                  onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                  className="w-full text-xs rounded-xl border border-gray-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-brand-red/20"
                />
              </div>

              {/* Thumbnail Upload (Optional) */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Foto / Gambar Thumbnail (Opsional)
                </label>
                <div className="flex items-start gap-4">
                  {thumbnailPreview ? (
                    <div className="relative w-32 h-24 rounded-xl border border-gray-200 overflow-hidden bg-gray-100 shrink-0">
                      <img src={thumbnailPreview} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          setThumbnailFile(null);
                          setThumbnailPreview('');
                          if (thumbInputRef.current) thumbInputRef.current.value = '';
                        }}
                        className="absolute top-1 right-1 bg-black/70 text-white rounded-full p-1 hover:bg-red-600 transition"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => thumbInputRef.current?.click()}
                      className="w-32 h-24 rounded-xl border-2 border-dashed border-gray-200 hover:border-brand-red/40 bg-gray-50 flex flex-col items-center justify-center text-gray-400 hover:text-brand-red cursor-pointer shrink-0 transition"
                    >
                      <ImageIcon size={20} />
                      <span className="text-[10px] mt-1 font-medium">Pilih Gambar</span>
                    </div>
                  )}

                  <div className="text-xs text-gray-500 space-y-1.5">
                    <p className="font-medium text-gray-700">Unggah gambar thumbnail</p>
                    <p className="text-[11px] text-gray-400">
                      Format: JPG, PNG, WEBP (Maks. 5MB). Digunakan sebagai sampul kartu konten.
                    </p>
                    <input
                      ref={thumbInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailChange}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => thumbInputRef.current?.click()}
                      className="text-xs font-semibold text-brand-red hover:underline"
                    >
                      {thumbnailPreview ? 'Ganti Gambar' : 'Pilih File dari Komputer'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Video Specific Section */}
              {formData.type === 'video' && (
                <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-100 space-y-3.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                      <VideoIcon size={15} /> Sumber Video Tutorial <span className="text-red-500">*</span>
                    </label>

                    <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-indigo-200 text-xs">
                      <button
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, video_source_type: 'url' }))}
                        className={`px-2.5 py-1 rounded-md transition font-medium ${
                          formData.video_source_type === 'url'
                            ? 'bg-indigo-600 text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        Link URL / YouTube
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, video_source_type: 'file' }))}
                        className={`px-2.5 py-1 rounded-md transition font-medium ${
                          formData.video_source_type === 'file'
                            ? 'bg-indigo-600 text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        Upload File Video
                      </button>
                    </div>
                  </div>

                  {formData.video_source_type === 'url' ? (
                    <div>
                      <div className="relative">
                        <LinkIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="url"
                          placeholder="https://www.youtube.com/watch?v=... atau link video MP4"
                          value={formData.video_url}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, video_url: e.target.value }))
                          }
                          className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-indigo-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      <p className="text-[11px] text-gray-500 mt-1">
                        Mendukung link video YouTube atau URL streaming video langsung.
                      </p>
                    </div>
                  ) : (
                    <div>
                      <input
                        ref={videoInputRef}
                        type="file"
                        accept="video/*"
                        onChange={handleVideoFileChange}
                        className="hidden"
                      />
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => videoInputRef.current?.click()}
                          className="flex items-center gap-1.5 text-xs font-semibold bg-white border border-indigo-300 text-indigo-700 px-3.5 py-2 rounded-xl hover:bg-indigo-50 transition"
                        >
                          <Upload size={14} /> {videoFile ? 'Ganti File Video' : 'Pilih File Video'}
                        </button>
                        <span className="text-xs text-gray-600 truncate max-w-xs">
                          {videoFile
                            ? `${videoFile.name} (${(videoFile.size / (1024 * 1024)).toFixed(1)} MB)`
                            : existingVideoUrl && existingVideoUrl.includes('/uploads/videos/')
                            ? 'Video tersimpan di server'
                            : 'Belum ada file video dipilih (Maks. 100MB)'}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Video Live Preview */}
                  {(videoPreview || (formData.type === 'video' && formData.video_url)) && (
                    <div className="mt-2 rounded-xl overflow-hidden bg-black/80 aspect-video max-h-48 flex items-center justify-center">
                      {videoPreview ? (
                        <video src={videoPreview} controls className="w-full h-full object-contain" />
                      ) : getYoutubeEmbedUrl(formData.video_url) ? (
                        <iframe
                          src={getYoutubeEmbedUrl(formData.video_url)}
                          title="YouTube video player"
                          className="w-full h-full"
                          allowFullScreen
                        />
                      ) : (
                        <video src={formData.video_url} controls className="w-full h-full object-contain" />
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Body / Content Text */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  {formData.type === 'video'
                    ? 'Deskripsi & Ringkasan Video'
                    : 'Isi Panduan Lengkap / Artikel'}{' '}
                  <span className="text-gray-400 font-normal">(Mendukung baris baru)</span>
                </label>
                <textarea
                  rows={6}
                  placeholder={
                    formData.type === 'video'
                      ? 'Tuliskan deskripsi video tutorial, poin-poin penting, atau langkah-langkah yang dipraktikkan...'
                      : 'Tuliskan materi panduan edukasi, tips sebelum bencana, saat bencana, dan setelah bencana...'
                  }
                  value={formData.body}
                  onChange={(e) => setFormData((prev) => ({ ...prev, body: e.target.value }))}
                  className="w-full text-xs rounded-xl border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red leading-relaxed"
                />
              </div>

              {/* Publication Status Selection */}
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-gray-800">Status Publikasi Konten</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Tentukan apakah konten langsung disebarkan atau disimpan sebagai draf sementara.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, status: 'draft' }))}
                    className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition ${
                      formData.status === 'draft'
                        ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    Simpan Draf
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, status: 'distribusikan' }))}
                    className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition ${
                      formData.status === 'distribusikan'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    Distribusikan
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-brand-red hover:bg-red-700 rounded-xl shadow transition disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <Loader2 size={14} className="animate-spin" /> Menyimpan...
                    </>
                  ) : isEditing ? (
                    'Perbarui Konten'
                  ) : formData.status === 'distribusikan' ? (
                    'Simpan & Distribusikan'
                  ) : (
                    'Simpan Sebagai Draf'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. Preview Modal */}
      {previewItem && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl animate-in fade-in zoom-in-95">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/70 rounded-t-2xl">
              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    previewItem.status === 'distribusikan' ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-white'
                  }`}
                >
                  {previewItem.status.toUpperCase()}
                </span>
                <span className="text-xs font-semibold text-gray-500">{previewItem.category}</span>
              </div>
              <button
                onClick={() => setPreviewItem(null)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-200/60 transition"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4">
              <h2 className="text-xl font-bold text-gray-900">{previewItem.title}</h2>

              {/* Video Player in Preview */}
              {previewItem.type === 'video' && previewItem.video_url && (
                <div className="rounded-xl overflow-hidden bg-black aspect-video">
                  {getYoutubeEmbedUrl(previewItem.video_url) ? (
                    <iframe
                      src={getYoutubeEmbedUrl(previewItem.video_url)}
                      title="YouTube Preview"
                      className="w-full h-full"
                      allowFullScreen
                    />
                  ) : (
                    <video src={previewItem.video_url} controls className="w-full h-full object-contain" />
                  )}
                </div>
              )}

              {/* Thumbnail in Preview for Article */}
              {previewItem.type === 'artikel' && previewItem.thumbnail_url && (
                <div className="rounded-xl overflow-hidden max-h-64 bg-gray-100">
                  <img src={previewItem.thumbnail_url} alt={previewItem.title} className="w-full h-full object-cover" />
                </div>
              )}

              {/* Body */}
              <div className="text-xs text-gray-700 whitespace-pre-line leading-relaxed border-t pt-4">
                {previewItem.body || '(Tidak ada teks deskripsi)'}
              </div>
            </div>

            <div className="px-6 py-3 border-t border-gray-100 bg-gray-50 rounded-b-2xl flex items-center justify-between">
              <span className="text-[11px] text-gray-400">
                Slug: /edukasi/{previewItem.slug}
              </span>
              <button
                onClick={() => setPreviewItem(null)}
                className="text-xs font-semibold text-gray-700 hover:underline"
              >
                Tutup Pratinjau
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
