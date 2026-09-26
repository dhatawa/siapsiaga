import { useState, useEffect } from 'react';
import {
  Info,
  AlertTriangle,
  Zap,
  MapPin,
  Megaphone,
  CheckCircle2,
  Trash2,
  Clock,
  Send,
  Loader2,
  Sparkles,
  ShieldAlert,
  Radio
} from 'lucide-react';
import Swal from 'sweetalert2';
import { alertService } from '../../services/alertService';

const AVAILABLE_AREAS = [
  'Semua Wilayah',
  'Bandung & Sekitarnya',
  'DKI Jakarta',
  'Jawa Barat',
  'Banten',
  'Jawa Tengah',
  'Jawa Timur',
  'Sumatera Barat'
];

const TEMPLATES = [
  {
    title: 'Peringatan Dini Banjir',
    level: 'bahaya',
    text: 'PERINGATAN DARURAT: Debit air sungai naik melebihi batas aman. Warga di bantaran sungai diimbau segera evakuasi ke posko terdekat.'
  },
  {
    title: 'Siaga Gempa Bumi',
    level: 'bahaya',
    text: 'PERINGATAN GEMPA: Terjadi getaran gempa di wilayah sekitar. Harap tetap berada di luar bangunan dan hindari tiang listrik serta kaca.'
  },
  {
    title: 'Waspada Cuaca Ekstrem',
    level: 'peringatan',
    text: 'WASPADA CUACA: BMKG memprediksi potensi hujan lebat disertai angin kencang petir sore hingga malam hari. Hindari berteduh di bawah pohon.'
  },
  {
    title: 'Info Pemeliharaan Sirene',
    level: 'info',
    text: 'INFORMASI: Petugas sedang melakukan uji berkala sirene sistem peringatan dini di beberapa titik. Warga diimbau untuk tetap tenang.'
  }
];

export default function AdminPeringatan() {
  const [selectedAreas, setSelectedAreas] = useState(['Semua Wilayah']);
  const [level, setLevel] = useState('bahaya');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [broadcasts, setBroadcasts] = useState([]);
  const [fetchingBroadcasts, setFetchingBroadcasts] = useState(true);

  // Fetch broadcasts history from DB
  const loadBroadcasts = async () => {
    try {
      setFetchingBroadcasts(true);
      const data = await alertService.getAllAlerts();
      setBroadcasts(data || []);
    } catch (err) {
      console.warn('Failed to load broadcasts:', err);
    } finally {
      setFetchingBroadcasts(false);
    }
  };

  useEffect(() => {
    loadBroadcasts();
  }, []);

  const toggleArea = (area) => {
    if (area === 'Semua Wilayah') {
      setSelectedAreas(['Semua Wilayah']);
      return;
    }

    setSelectedAreas((prev) => {
      const filtered = prev.filter((a) => a !== 'Semua Wilayah');
      if (filtered.includes(area)) {
        const next = filtered.filter((a) => a !== area);
        return next.length === 0 ? ['Semua Wilayah'] : next;
      } else {
        return [...filtered, area];
      }
    });
  };

  const applyTemplate = (tpl) => {
    setLevel(tpl.level);
    setMessage(tpl.text);
  };

  const handleSendBroadcast = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    if (!message.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Pesan Belum Diisi',
        text: 'Silakan ketik pesan peringatan darurat sebelum mengirim.',
        confirmButtonColor: '#C81E2C'
      });
      return;
    }

    const levelText =
      level === 'bahaya'
        ? 'BAHAYA TINGGI (MERAH)'
        : level === 'peringatan'
        ? 'PERINGATAN SIAGA (KUNING)'
        : 'INFORMASI KESELAMATAN (BIRU)';

    const result = await Swal.fire({
      title: 'Konfirmasi Kirim Siaran?',
      html: `
        <div class="text-left text-xs space-y-2 mt-2">
          <p><strong>Tingkat Peringatan:</strong> <span class="uppercase font-bold">${levelText}</span></p>
          <p><strong>Target Wilayah:</strong> ${selectedAreas.join(', ')}</p>
          <p><strong>Isi Pesan:</strong> "${message}"</p>
          <p class="text-red-600 font-semibold pt-2 border-t text-[11px]">Peringatan ini akan otomatis masuk ke tabel database dan notifikasi seluruh pengguna.</p>
        </div>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#C81E2C',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Ya, Kirim Sekarang',
      cancelButtonText: 'Batal'
    });

    if (!result.isConfirmed) return;

    try {
      setLoading(true);
      await alertService.createAlert({
        level,
        message: message.trim(),
        target_areas: selectedAreas
      });

      await Swal.fire({
        icon: 'success',
        title: 'Peringatan Berhasil Dikirim!',
        text: 'Siaran darurat telah disimpan ke database dan disebarkan ke notifikasi pengguna.',
        confirmButtonColor: '#C81E2C',
        timer: 2000,
        showConfirmButton: true
      });

      setMessage('');
      loadBroadcasts();
    } catch (err) {
      console.error('Error sending alert:', err);
      Swal.fire({
        icon: 'error',
        title: 'Gagal Mengirim',
        text: err.message || 'Terjadi kesalahan saat menyiarkan peringatan.',
        confirmButtonColor: '#C81E2C'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBroadcast = async (id) => {
    const result = await Swal.fire({
      title: 'Hapus Riwayat Peringatan?',
      text: 'Riwayat siaran ini akan dihapus permanen dari sistem.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#C81E2C',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Ya, Hapus',
      cancelButtonText: 'Batal'
    });

    if (!result.isConfirmed) return;

    try {
      await alertService.deleteAlert(id);
      Swal.fire({
        icon: 'success',
        title: 'Terhapus',
        text: 'Riwayat siaran berhasil dihapus.',
        timer: 1500,
        showConfirmButton: false
      });
      loadBroadcasts();
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: err.message,
        confirmButtonColor: '#C81E2C'
      });
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <Megaphone size={24} className="text-brand-red" /> Pusat Pengiriman Peringatan
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Siarkan peringatan darurat seketika kepada seluruh warga dan feed notifikasi aplikasi.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1.6fr_1fr] gap-6">
        {/* Left: Form Siaran Peringatan */}
        <form
          onSubmit={handleSendBroadcast}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5"
        >
          {/* Level Peringatan */}
          <div>
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-2.5">
              Pilih Tingkat Peringatan
            </label>
            <div className="grid grid-cols-3 gap-3">
              {/* Bahaya */}
              <button
                type="button"
                onClick={() => setLevel('bahaya')}
                className={`flex flex-col items-center justify-center gap-1.5 p-3.5 rounded-xl border-2 transition text-xs font-bold cursor-pointer ${
                  level === 'bahaya'
                    ? 'bg-red-50 border-brand-red text-brand-red shadow-sm'
                    : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                }`}
              >
                <Zap size={20} className={level === 'bahaya' ? 'text-brand-red fill-brand-red' : ''} />
                <span>Bahaya Darurat</span>
                <span className="text-[10px] font-normal opacity-75">Merah • Evakuasi</span>
              </button>

              {/* Peringatan */}
              <button
                type="button"
                onClick={() => setLevel('peringatan')}
                className={`flex flex-col items-center justify-center gap-1.5 p-3.5 rounded-xl border-2 transition text-xs font-bold cursor-pointer ${
                  level === 'peringatan'
                    ? 'bg-amber-50 border-amber-500 text-amber-700 shadow-sm'
                    : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                }`}
              >
                <AlertTriangle size={20} className={level === 'peringatan' ? 'text-amber-500 fill-amber-500' : ''} />
                <span>Peringatan Siaga</span>
                <span className="text-[10px] font-normal opacity-75">Kuning • Waspada</span>
              </button>

              {/* Info */}
              <button
                type="button"
                onClick={() => setLevel('info')}
                className={`flex flex-col items-center justify-center gap-1.5 p-3.5 rounded-xl border-2 transition text-xs font-bold cursor-pointer ${
                  level === 'info'
                    ? 'bg-blue-50 border-blue-600 text-blue-700 shadow-sm'
                    : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                }`}
              >
                <Info size={20} className={level === 'info' ? 'text-blue-600' : ''} />
                <span>Informasi Publik</span>
                <span className="text-[10px] font-normal opacity-75">Biru • Edukasi/Tes</span>
              </button>
            </div>
          </div>

          {/* Template Pesan Cepat */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                Template Pesan Cepat
              </label>
              <span className="text-[11px] text-gray-400 flex items-center gap-1">
                <Sparkles size={12} className="text-amber-500" /> Klik untuk terapkan
              </span>
            </div>
            <div className="grid sm:grid-cols-2 gap-2">
              {TEMPLATES.map((t) => (
                <button
                  key={t.title}
                  type="button"
                  onClick={() => applyTemplate(t)}
                  className="p-2.5 rounded-xl border border-gray-100 bg-gray-50/70 hover:bg-gray-100 text-left transition cursor-pointer"
                >
                  <p className="text-xs font-bold text-gray-800">{t.title}</p>
                  <p className="text-[11px] text-gray-500 line-clamp-1 mt-0.5">{t.text}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Pesan Peringatan */}
          <div>
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-2">
              Pesan Siaran Peringatan
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value.slice(0, 160))}
              rows={4}
              maxLength={160}
              placeholder="Ketik instruksi darurat atau tindakan keselamatan yang harus segera diambil warga..."
              className="w-full border border-gray-200 rounded-xl p-3.5 text-xs outline-none focus:ring-2 focus:ring-primary-700/20 focus:border-primary-700 resize-none transition text-gray-800 leading-relaxed font-sans"
            />
            <div className="flex items-center justify-between mt-1 text-[11px] text-gray-400">
              <span>{message.length}/160 karakter (Maksimal panjang SMS & Push Notification)</span>
              {message.length > 140 && <span className="text-amber-600 font-semibold">Mendekati batas</span>}
            </div>
          </div>

          {/* Live Preview Box */}
          {message.trim() && (
            <div
              className={`p-3.5 rounded-xl border flex items-start gap-3 ${
                level === 'bahaya'
                  ? 'bg-red-50/80 border-red-200 text-red-900'
                  : level === 'peringatan'
                  ? 'bg-amber-50/80 border-amber-200 text-amber-900'
                  : 'bg-blue-50/80 border-blue-200 text-blue-900'
              }`}
            >
              <Radio size={18} className="shrink-0 mt-0.5 animate-pulse text-brand-red" />
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-1.5 py-0.2 rounded bg-white/70">
                    Pratinjau {level.toUpperCase()}
                  </span>
                  <span className="text-[11px] font-semibold opacity-75">
                    Target: {selectedAreas.join(', ')}
                  </span>
                </div>
                <p className="text-xs font-medium leading-relaxed">{message}</p>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !message.trim()}
            className="w-full bg-brand-red hover:bg-red-700 disabled:opacity-50 text-white text-xs font-bold py-3.5 rounded-xl shadow-md flex items-center justify-center gap-2 transition active:scale-98 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                MENYIARKAN PERINGATAN...
              </>
            ) : (
              <>
                <Megaphone size={16} />
                KIRIM PERINGATAN DARURAT
              </>
            )}
          </button>
        </form>

        {/* Right: Riwayat Pengiriman Terbaru */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-brand-red" />
                <h3 className="text-sm font-bold text-gray-900">Pengiriman Terbaru</h3>
              </div>
              <span className="text-xs text-gray-400 font-medium">
                {broadcasts.length} siaran
              </span>
            </div>

            {fetchingBroadcasts ? (
              <div className="py-12 flex flex-col items-center justify-center text-gray-400 gap-2">
                <Loader2 size={24} className="animate-spin text-brand-red" />
                <span className="text-xs">Memuat riwayat pengiriman...</span>
              </div>
            ) : broadcasts.length > 0 ? (
              <div className="space-y-3.5 max-h-[500px] overflow-y-auto pr-1">
                {broadcasts.map((b) => {
                  const isBahaya = b.level === 'bahaya';
                  const isPeringatan = b.level === 'peringatan';
                  const levelBadge = isBahaya
                    ? 'bg-red-50 text-brand-red border-red-200'
                    : isPeringatan
                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : 'bg-blue-50 text-blue-700 border-blue-200';

                  const areas = Array.isArray(b.target_areas)
                    ? b.target_areas.join(', ')
                    : b.target_areas || 'Semua Wilayah';

                  return (
                    <div
                      key={b.id}
                      className="p-3.5 rounded-xl border border-gray-100 hover:border-gray-200 transition bg-gray-50/50 relative group"
                    >
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md border uppercase ${levelBadge}`}>
                          {b.level}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-gray-400">
                            {new Date(b.sent_at).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleDeleteBroadcast(b.id)}
                            className="text-gray-300 hover:text-brand-red p-1 rounded transition opacity-0 group-hover:opacity-100 cursor-pointer"
                            title="Hapus riwayat siaran"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>

                      <p className="text-xs font-semibold text-gray-800 leading-snug">{b.message}</p>
                      
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100 text-[10px] text-gray-400">
                        <span className="truncate max-w-[180px]">📍 {areas}</span>
                        <span className="text-emerald-600 font-medium">✓ Terkirim</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-12 text-center text-gray-400">
                <ShieldAlert size={36} className="mx-auto mb-2 text-gray-300" />
                <p className="text-xs">Belum ada riwayat peringatan yang dikirim.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
