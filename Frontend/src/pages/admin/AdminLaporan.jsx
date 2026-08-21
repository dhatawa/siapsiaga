import { useState, useEffect } from 'react';
import {
  Eye,
  Trash2,
  ChevronDown,
  Droplets,
  Flame,
  Mountain,
  Wind,
  Waves,
  Activity,
  ShieldAlert,
  Search,
  RefreshCw,
  Loader2,
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  ExternalLink,
  Calendar,
  User,
  AlertTriangle,
  X,
  FileCheck,
  PhoneCall,
  Check
} from 'lucide-react';
import Swal from 'sweetalert2';
import { reportService } from '../../services/reportService';

const DISASTER_MAP = {
  banjir: { label: 'Banjir', icon: Droplets, color: 'bg-blue-50 text-blue-700 border-blue-200' },
  gempa_bumi: { label: 'Gempa Bumi', icon: Activity, color: 'bg-red-50 text-red-700 border-red-200' },
  tsunami: { label: 'Tsunami', icon: Waves, color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  kebakaran: { label: 'Kebakaran', icon: Flame, color: 'bg-orange-50 text-orange-700 border-orange-200' },
  longsor: { label: 'Tanah Longsor', icon: Mountain, color: 'bg-amber-50 text-amber-800 border-amber-200' },
  angin_kencang: { label: 'Angin Kencang', icon: Wind, color: 'bg-cyan-50 text-cyan-700 border-cyan-200' },
  lainnya: { label: 'Lainnya', icon: ShieldAlert, color: 'bg-gray-50 text-gray-700 border-gray-200' },
};

const STATUS_BADGES = {
  menunggu: {
    label: 'Menunggu',
    bg: 'bg-amber-50 text-amber-700 border-amber-200',
    dot: 'bg-amber-500'
  },
  divalidasi: {
    label: 'Divalidasi',
    bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dot: 'bg-emerald-500'
  },
  ditolak: {
    label: 'Ditolak',
    bg: 'bg-rose-50 text-rose-700 border-rose-200',
    dot: 'bg-rose-500'
  }
};

export default function AdminLaporan() {
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState({ total: 0, menunggu: 0, divalidasi: 0, ditolak: 0 });
  const [loading, setLoading] = useState(true);

  // Filters
  const [statusFilter, setStatusFilter] = useState('Semua Status');
  const [disasterFilter, setDisasterFilter] = useState('Semua Jenis');
  const [searchQuery, setSearchQuery] = useState('');

  // Detail Modal State
  const [selectedReport, setSelectedReport] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch Reports from MySQL
  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await reportService.getAdminReports({
        status: statusFilter,
        disaster_type: disasterFilter,
        search: searchQuery
      });
      setReports(res.items || []);
      setStats(res.stats || { total: 0, menunggu: 0, divalidasi: 0, ditolak: 0 });
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Gagal Memuat Laporan',
        text: err.message || 'Terjadi kesalahan saat memuat data laporan insiden.',
        confirmButtonColor: '#C81E2C'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [statusFilter, disasterFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchReports();
  };

  // Moderation Action (Approve / Reject)
  const handleValidateReport = async (report, newStatus) => {
    const isApprove = newStatus === 'divalidasi';
    const title = isApprove ? 'Validasi & Publikasikan Laporan?' : 'Tolak Laporan Insiden?';
    const text = isApprove
      ? `Laporan insiden di ${report.location_text} akan disetujui dan disebarluaskan ke seluruh pengguna Siap Siaga.`
      : `Laporan insiden ini akan ditandai sebagai tidak valid / ditolak.`;

    const result = await Swal.fire({
      title: title,
      text: text,
      icon: isApprove ? 'question' : 'warning',
      showCancelButton: true,
      confirmButtonColor: isApprove ? '#059669' : '#DC2626',
      cancelButtonColor: '#6B7280',
      confirmButtonText: isApprove ? 'Ya, Validasi & Publikasikan' : 'Ya, Tolak Laporan',
      cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
      try {
        setActionLoading(true);
        await reportService.validateReport(report.id, newStatus);

        Swal.fire({
          icon: 'success',
          title: isApprove ? 'Laporan Divalidasi!' : 'Laporan Ditolak',
          text: `Status laporan #${report.id} berhasil diperbarui menjadi ${newStatus}.`,
          timer: 1600,
          showConfirmButton: false
        });

        // Update active modal if open
        if (selectedReport && selectedReport.id === report.id) {
          setSelectedReport((prev) => ({ ...prev, status: newStatus }));
        }

        fetchReports();
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Gagal Memproses Laporan',
          text: err.message || 'Terjadi kesalahan sistem.',
          confirmButtonColor: '#C81E2C'
        });
      } finally {
        setActionLoading(false);
      }
    }
  };

  // Delete Action
  const handleDeleteReport = async (report, e) => {
    e?.stopPropagation();
    const result = await Swal.fire({
      title: 'Hapus Laporan Ini?',
      text: `Laporan #${report.id} di "${report.location_text}" akan dihapus permanen dari sistem.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#C81E2C',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Ya, Hapus Permanen',
      cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
      try {
        await reportService.deleteReport(report.id);
        Swal.fire({
          icon: 'success',
          title: 'Laporan Dihapus',
          text: 'Data laporan berhasil dihapus.',
          timer: 1500,
          showConfirmButton: false
        });
        if (selectedReport && selectedReport.id === report.id) {
          setSelectedReport(null);
        }
        fetchReports();
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Gagal Menghapus',
          text: err.message || 'Terjadi kesalahan saat menghapus laporan.',
          confirmButtonColor: '#C81E2C'
        });
      }
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header Section */}
      <div className="flex items-start justify-between flex-wrap gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-red-50 text-brand-red">
              <ShieldAlert size={22} />
            </span>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Manajemen Laporan Insiden</h1>
          </div>
          <p className="text-sm text-gray-500 mt-1.5 ml-10">
            Tinjau, periksa titik koordinat GPS, dan validasi laporan bencana yang dikirimkan oleh pengguna masyarakat.
          </p>
        </div>

        <button
          onClick={fetchReports}
          disabled={loading}
          className="p-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors ml-10 sm:ml-0"
          title="Muat Ulang Data"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin text-brand-red' : ''} />
        </button>
      </div>

      {/* 2. Counter Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-700 font-bold">
            <FileCheck size={18} />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium">Total Laporan Masuk</p>
            <p className="text-xl font-bold text-gray-900">{stats.total}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-amber-100 shadow-sm flex items-center gap-3 bg-amber-50/20">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold relative">
            <Clock size={18} />
            {stats.menunggu > 0 && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-500 rounded-full animate-ping" />
            )}
          </div>
          <div>
            <p className="text-xs text-amber-700 font-semibold">Menunggu Validasi</p>
            <p className="text-xl font-bold text-amber-700">{stats.menunggu}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-emerald-100 shadow-sm flex items-center gap-3 bg-emerald-50/20">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <CheckCircle2 size={18} />
          </div>
          <div>
            <p className="text-xs text-emerald-700 font-semibold">Telah Divalidasi</p>
            <p className="text-xl font-bold text-emerald-700">{stats.divalidasi}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-rose-100 shadow-sm flex items-center gap-3 bg-rose-50/20">
          <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
            <XCircle size={18} />
          </div>
          <div>
            <p className="text-xs text-rose-700 font-semibold">Laporan Ditolak</p>
            <p className="text-xl font-bold text-rose-700">{stats.ditolak}</p>
          </div>
        </div>
      </div>

      {/* 3. Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          {['Semua Status', 'menunggu', 'divalidasi', 'ditolak'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`text-xs font-semibold px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
                statusFilter === st
                  ? 'bg-brand-red text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100 capitalize'
              }`}
            >
              {st === 'Semua Status' ? 'Semua Status' : st === 'menunggu' ? 'Menunggu Validasi' : st === 'divalidasi' ? 'Divalidasi' : 'Ditolak'}
            </button>
          ))}
        </div>

        {/* Search & Disaster Filter */}
        <div className="flex items-center flex-wrap sm:flex-nowrap gap-2.5 w-full md:w-auto">
          <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-60">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Cari lokasi / pelapor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red"
            />
          </form>

          {/* Disaster Type Filter */}
          <div className="relative w-full sm:w-44">
            <select
              value={disasterFilter}
              onChange={(e) => setDisasterFilter(e.target.value)}
              className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-700 text-xs rounded-xl px-3 py-2 pr-7 font-medium focus:outline-none focus:ring-2 focus:ring-brand-red/20"
            >
              <option value="Semua Jenis">Semua Jenis Bencana</option>
              <option value="banjir">Banjir</option>
              <option value="gempa_bumi">Gempa Bumi</option>
              <option value="tsunami">Tsunami</option>
              <option value="kebakaran">Kebakaran</option>
              <option value="longsor">Tanah Longsor</option>
              <option value="angin_kencang">Angin Kencang</option>
              <option value="lainnya">Lainnya</option>
            </select>
            <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* 4. Reports Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-brand-red animate-spin mb-3" />
            <p className="text-sm font-medium text-gray-500">Memuat data laporan...</p>
          </div>
        ) : reports.length === 0 ? (
          <div className="text-center py-16 p-6">
            <ShieldAlert size={36} className="text-gray-300 mx-auto mb-2" />
            <h3 className="text-base font-bold text-gray-800">Tidak Ada Laporan Insiden</h3>
            <p className="text-xs text-gray-500 mt-1">
              Tidak ada data laporan yang sesuai dengan kriteria filter saat ini.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-gray-50/70 border-b border-gray-100 text-gray-400 uppercase font-semibold text-[10px] tracking-wider">
                  <th className="px-5 py-3.5">Pelapor</th>
                  <th className="px-4 py-3.5">Jenis Bencana</th>
                  <th className="px-4 py-3.5">Lokasi & GPS</th>
                  <th className="px-4 py-3.5">Waktu Lapor</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Aksi & Moderasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {reports.map((r) => {
                  const disasterInfo = DISASTER_MAP[r.disaster_type] || DISASTER_MAP.lainnya;
                  const DisasterIcon = disasterInfo.icon;
                  const statusInfo = STATUS_BADGES[r.status] || STATUS_BADGES.menunggu;

                  return (
                    <tr
                      key={r.id}
                      onClick={() => setSelectedReport(r)}
                      className="hover:bg-gray-50/70 transition-colors cursor-pointer group"
                    >
                      {/* Pelapor */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-red-100 text-brand-red flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden shadow-2xs">
                            {r.reporter_avatar ? (
                              <img src={r.reporter_avatar} alt={r.reporter_name} className="w-full h-full object-cover" />
                            ) : (
                              (r.reporter_name ? r.reporter_name.charAt(0).toUpperCase() : 'U')
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-gray-900 truncate">
                              {r.reporter_name || 'Pengguna Terdaftar'}
                            </p>
                            <p className="text-[11px] text-gray-400 truncate">{r.reporter_email || '-'}</p>
                          </div>
                        </div>
                      </td>

                      {/* Jenis Bencana */}
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold border ${disasterInfo.color}`}
                        >
                          <DisasterIcon size={13} /> {disasterInfo.label}
                        </span>
                      </td>

                      {/* Lokasi & GPS */}
                      <td className="px-4 py-3.5 max-w-xs">
                        <p className="font-semibold text-gray-800 truncate" title={r.location_text}>
                          {r.location_text}
                        </p>
                        {r.latitude && r.longitude ? (
                          <span className="text-[10px] text-emerald-700 flex items-center gap-1 mt-0.5 font-mono">
                            <MapPin size={11} className="text-emerald-600" />
                            {parseFloat(r.latitude).toFixed(4)}, {parseFloat(r.longitude).toFixed(4)}
                          </span>
                        ) : (
                          <span className="text-[10px] text-gray-400 mt-0.5 block">GPS manual</span>
                        )}
                      </td>

                      {/* Waktu Lapor */}
                      <td className="px-4 py-3.5 text-gray-500 whitespace-nowrap">
                        <p className="font-medium text-gray-700">
                          {new Date(r.created_at).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </p>
                        <p className="text-[10px] text-gray-400">
                          {new Date(r.created_at).toLocaleTimeString('id-ID', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}{' '}
                          WIB
                        </p>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold border ${statusInfo.bg}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dot}`} />
                          {statusInfo.label}
                        </span>
                      </td>

                      {/* Aksi */}
                      <td className="px-5 py-3.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                          {/* Tombol Lihat Detail */}
                          <button
                            onClick={() => setSelectedReport(r)}
                            className="p-1.5 rounded-lg text-primary-700 hover:bg-red-50 transition"
                            title="Lihat Detail Lengkap Laporan"
                          >
                            <Eye size={16} />
                          </button>

                          {/* Quick Approve button */}
                          {r.status !== 'divalidasi' && (
                            <button
                              onClick={() => handleValidateReport(r, 'divalidasi')}
                              className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition"
                              title="Validasi & Publikasikan"
                            >
                              <Check size={16} />
                            </button>
                          )}

                          {/* Quick Reject button */}
                          {r.status !== 'ditolak' && (
                            <button
                              onClick={() => handleValidateReport(r, 'ditolak')}
                              className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition"
                              title="Tolak Laporan"
                            >
                              <XCircle size={16} />
                            </button>
                          )}

                          {/* Tombol Hapus */}
                          <button
                            onClick={(e) => handleDeleteReport(r, e)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-gray-100 transition"
                            title="Hapus Laporan"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex items-center justify-between px-5 py-3.5 border-t border-gray-100 text-xs text-gray-500 bg-gray-50/50">
          <span>Menampilkan {reports.length} laporan insiden</span>
          <span className="text-[11px] text-gray-400">Klik baris tabel untuk meninjau foto & verifikasi koordinat</span>
        </div>
      </div>

      {/* 5. Modal Detail Laporan (Wajib sebelum Approve) */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/80 rounded-t-2xl">
              <div className="flex items-center gap-2.5">
                <span className="p-1.5 rounded-lg bg-red-100 text-brand-red">
                  <ShieldAlert size={18} />
                </span>
                <div>
                  <h3 className="text-base font-bold text-gray-900">Detail Laporan Insiden #{selectedReport.id}</h3>
                  <p className="text-xs text-gray-500">Tinjau informasi kejadian sebelum mengambil keputusan moderasi</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedReport(null)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-200/60 transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* Status Banner */}
              <div
                className={`p-3.5 rounded-xl border flex items-center justify-between ${
                  selectedReport.status === 'divalidasi'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : selectedReport.status === 'ditolak'
                    ? 'bg-rose-50 border-rose-200 text-rose-800'
                    : 'bg-amber-50 border-amber-200 text-amber-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  {selectedReport.status === 'divalidasi' ? (
                    <CheckCircle2 size={18} className="text-emerald-600" />
                  ) : selectedReport.status === 'ditolak' ? (
                    <XCircle size={18} className="text-rose-600" />
                  ) : (
                    <Clock size={18} className="text-amber-600" />
                  )}
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider">
                      STATUS: {selectedReport.status === 'divalidasi' ? 'TERVALIDASI & DIPUBLIKASIKAN' : selectedReport.status === 'ditolak' ? 'DITOLAK' : 'MENUNGGU VALIDASI ADMIN'}
                    </span>
                    {selectedReport.validator_name && (
                      <p className="text-[11px] mt-0.5">
                        Diproses oleh: <strong>{selectedReport.validator_name}</strong>
                      </p>
                    )}
                  </div>
                </div>

                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${
                    (DISASTER_MAP[selectedReport.disaster_type] || DISASTER_MAP.lainnya).color
                  }`}
                >
                  {(DISASTER_MAP[selectedReport.disaster_type] || DISASTER_MAP.lainnya).label}
                </span>
              </div>

              {/* Foto Bukti Kejadian */}
              <div>
                <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Foto Bukti Lapangan</h4>
                {selectedReport.photo_url ? (
                  <div className="rounded-xl overflow-hidden border border-gray-200 bg-black/90 max-h-72 flex items-center justify-center">
                    <img
                      src={selectedReport.photo_url}
                      alt="Foto Bukti Kejadian"
                      className="w-full h-full object-contain max-h-72"
                    />
                  </div>
                ) : (
                  <div className="p-6 rounded-xl border border-dashed border-gray-200 bg-gray-50 text-center text-gray-400 text-xs">
                    Pelapor tidak menyertakan foto bukti kejadian.
                  </div>
                )}
              </div>

              {/* Detail Pelapor & Waktu */}
              <div className="grid sm:grid-cols-2 gap-4 bg-gray-50/70 p-4 rounded-xl border border-gray-200">
                <div>
                  <p className="text-[11px] text-gray-400 font-semibold uppercase">Informasi Pelapor</p>
                  <p className="text-xs font-bold text-gray-900 mt-1">{selectedReport.reporter_name || 'Anonim'}</p>
                  <p className="text-xs text-gray-500">{selectedReport.reporter_email || '-'}</p>
                </div>

                <div>
                  <p className="text-[11px] text-gray-400 font-semibold uppercase">Waktu Pengiriman</p>
                  <p className="text-xs font-bold text-gray-900 mt-1">
                    {new Date(selectedReport.created_at).toLocaleDateString('id-ID', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                  <p className="text-xs text-gray-500">
                    Pukul {new Date(selectedReport.created_at).toLocaleTimeString('id-ID')} WIB
                  </p>
                </div>
              </div>

              {/* Lokasi & Titik GPS */}
              <div>
                <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Lokasi & Titik GPS</h4>
                <div className="p-4 rounded-xl border border-gray-200 bg-white space-y-2.5">
                  <div className="flex items-start gap-2">
                    <MapPin size={16} className="text-brand-red shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-gray-800">{selectedReport.location_text}</p>
                      {selectedReport.latitude && selectedReport.longitude ? (
                        <p className="text-xs font-mono text-emerald-700 mt-0.5">
                          Latitude: {selectedReport.latitude}, Longitude: {selectedReport.longitude}
                        </p>
                      ) : (
                        <p className="text-xs text-gray-400 mt-0.5">Koordinat GPS tidak terekam otomatis.</p>
                      )}
                    </div>
                  </div>

                  {selectedReport.latitude && selectedReport.longitude && (
                    <a
                      href={`https://www.google.com/maps?q=${selectedReport.latitude},${selectedReport.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 border border-indigo-200 px-3 py-1.5 rounded-lg transition"
                    >
                      <ExternalLink size={13} /> Buka Titik di Google Maps
                    </a>
                  )}
                </div>
              </div>

              {/* Deskripsi Lengkap */}
              <div>
                <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Deskripsi Situasi</h4>
                <div className="p-4 rounded-xl border border-gray-200 bg-white text-xs text-gray-800 leading-relaxed whitespace-pre-line">
                  {selectedReport.description || '(Tidak ada deskripsi tambahan yang disertakan oleh pelapor)'}
                </div>
              </div>
            </div>

            {/* Modal Footer Moderation Actions */}
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl flex items-center justify-between flex-wrap gap-2.5">
              <button
                type="button"
                onClick={() => setSelectedReport(null)}
                className="px-4 py-2 text-xs font-semibold text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-100 transition"
              >
                Tutup
              </button>

              <div className="flex items-center gap-2">
                {/* Tolak Button */}
                {selectedReport.status !== 'ditolak' && (
                  <button
                    type="button"
                    disabled={actionLoading}
                    onClick={() => handleValidateReport(selectedReport, 'ditolak')}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-sm transition disabled:opacity-50"
                  >
                    <XCircle size={14} /> Tolak Laporan
                  </button>
                )}

                {/* Approve Button */}
                {selectedReport.status !== 'divalidasi' && (
                  <button
                    type="button"
                    disabled={actionLoading}
                    onClick={() => handleValidateReport(selectedReport, 'divalidasi')}
                    className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm transition disabled:opacity-50"
                  >
                    <CheckCircle2 size={14} /> Validasi & Publikasikan
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
