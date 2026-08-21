import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  UploadCloud,
  MapPin,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Image as ImageIcon,
  Compass,
  Droplets,
  Flame,
  Mountain,
  Wind,
  Waves,
  Activity,
  ShieldAlert
} from 'lucide-react';
import Swal from 'sweetalert2';
import { reportService } from '../services/reportService';
import { useAuth } from '../context/AuthContext';

const DISASTER_OPTIONS = [
  { value: 'banjir', label: 'Banjir', icon: Droplets, color: 'text-blue-600 bg-blue-50 border-blue-200' },
  { value: 'gempa_bumi', label: 'Gempa Bumi', icon: Activity, color: 'text-red-600 bg-red-50 border-red-200' },
  { value: 'tsunami', label: 'Tsunami', icon: Waves, color: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
  { value: 'kebakaran', label: 'Kebakaran', icon: Flame, color: 'text-orange-600 bg-orange-50 border-orange-200' },
  { value: 'longsor', label: 'Tanah Longsor', icon: Mountain, color: 'text-amber-700 bg-amber-50 border-amber-200' },
  { value: 'angin_kencang', label: 'Angin Kencang / Puting Beliung', icon: Wind, color: 'text-cyan-600 bg-cyan-50 border-cyan-200' },
  { value: 'lainnya', label: 'Insiden / Darurat Lainnya', icon: ShieldAlert, color: 'text-gray-700 bg-gray-50 border-gray-200' },
];

export default function LaporModal({ isOpen, onClose }) {
  const { user } = useAuth();

  const [disasterType, setDisasterType] = useState('banjir');
  const [locationText, setLocationText] = useState('');
  const [description, setDescription] = useState('');

  // GPS Geolocation States
  const [coords, setCoords] = useState({ latitude: null, longitude: null });
  const [gpsStatus, setGpsStatus] = useState('idle'); // 'idle' | 'searching' | 'success' | 'error' | 'denied'
  const [gpsErrorMsg, setGpsErrorMsg] = useState('');

  // Photo Upload States
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const fileInputRef = useRef(null);

  const [submitting, setSubmitting] = useState(false);

  // Request GPS position
  const getGpsPosition = () => {
    if (!navigator.geolocation) {
      setGpsStatus('error');
      setGpsErrorMsg('Peramban web tidak mendukung fitur geolokasi GPS.');
      return;
    }

    setGpsStatus('searching');
    setGpsErrorMsg('');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setCoords({ latitude: lat, longitude: lng });
        setGpsStatus('success');
      },
      (error) => {
        console.warn('Geolocation Error:', error);
        if (error.code === error.PERMISSION_DENIED) {
          setGpsStatus('denied');
          setGpsErrorMsg('Izin akses lokasi GPS ditolak oleh pengguna atau perangkat.');
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          setGpsStatus('error');
          setGpsErrorMsg('Sinyal GPS lokasi tidak tersedia saat ini.');
        } else if (error.code === error.TIMEOUT) {
          setGpsStatus('error');
          setGpsErrorMsg('Waktu permintaan lokasi GPS habis.');
        } else {
          setGpsStatus('error');
          setGpsErrorMsg('Gagal mendeteksi koordinat GPS perangkat.');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 0
      }
    );
  };

  // Otomatis minta GPS saat modal dibuka
  useEffect(() => {
    if (isOpen) {
      getGpsPosition();
    } else {
      // Reset form when closed
      setDisasterType('banjir');
      setLocationText('');
      setDescription('');
      setPhotoFile(null);
      setPhotoPreview('');
      setCoords({ latitude: null, longitude: null });
      setGpsStatus('idle');
      setGpsErrorMsg('');
    }
  }, [isOpen]);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        Swal.fire({
          icon: 'error',
          title: 'Format Tidak Valid',
          text: 'Harap pilih file gambar foto bukti kejadian (JPG, PNG, WEBP).',
          confirmButtonColor: '#C81E2C'
        });
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        Swal.fire({
          icon: 'warning',
          title: 'Ukuran Terlalu Besar',
          text: 'Maksimal ukuran foto adalah 10MB.',
          confirmButtonColor: '#C81E2C'
        });
        return;
      }
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleRemovePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      Swal.fire({
        icon: 'info',
        title: 'Harap Masuk Akun',
        text: 'Anda perlu masuk (login) ke akun Siap Siaga untuk dapat mengirimkan laporan bencana.',
        confirmButtonColor: '#C81E2C'
      });
      return;
    }

    if (!locationText.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Lokasi Belum Diisi',
        text: 'Harap masukkan nama jalan, desa, patokan atau wilayah kejadian insiden.',
        confirmButtonColor: '#C81E2C'
      });
      return;
    }

    // Jika GPS belum aktif atau ditolak
    if (!coords.latitude || !coords.longitude) {
      const confirmNoGps = await Swal.fire({
        title: 'Koordinat GPS Belum Terdeteksi',
        text: 'Koordinat lokasi GPS otomatis sangat dianjurkan untuk validasi cepat tim lapangan. Apakah Anda tetap ingin mengirim laporan ini hanya dengan teks lokasi?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#C81E2C',
        cancelButtonColor: '#6B7280',
        confirmButtonText: 'Tetap Kirim',
        cancelButtonText: 'Coba Nyalakan GPS'
      });

      if (!confirmNoGps.isConfirmed) {
        getGpsPosition();
        return;
      }
    }

    try {
      setSubmitting(true);

      const payload = new FormData();
      payload.append('disaster_type', disasterType);
      payload.append('location_text', locationText.trim());
      if (coords.latitude) payload.append('latitude', coords.latitude);
      if (coords.longitude) payload.append('longitude', coords.longitude);
      if (description.trim()) payload.append('description', description.trim());
      if (photoFile) payload.append('photo', photoFile);

      await reportService.createReport(payload);

      onClose();

      await Swal.fire({
        icon: 'success',
        title: 'Laporan Berhasil Terkirim!',
        html: `
          <div class="text-left text-xs text-gray-600 space-y-2 mt-2">
            <p>Laporan bencana Anda telah dicatat dalam sistem dengan status <b>Menunggu Validasi</b>.</p>
            <div class="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-800">
              ⚠️ <b>Catatan Verifikasi:</b> Tim administrator Siap Siaga akan memeriksa keabsahan foto, deskripsi, dan titik koordinat GPS sebelum laporan dipublikasikan secara luas ke masyarakat.
            </div>
            <p>Terima kasih telah berkontribusi menjaga keselamatan sesama.</p>
          </div>
        `,
        confirmButtonColor: '#C81E2C',
        confirmButtonText: 'Selesai'
      });
    } catch (err) {
      console.error('Submit report error:', err);
      Swal.fire({
        icon: 'error',
        title: 'Gagal Mengirim Laporan',
        text: err.message || 'Terjadi kesalahan pada sistem saat mengirim laporan.',
        confirmButtonColor: '#C81E2C'
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[92vh] flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header Modal */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-red-50/50 rounded-t-2xl">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-brand-red text-white flex items-center justify-center shadow-sm">
              <ShieldAlert size={18} />
            </span>
            <div>
              <h3 className="text-base font-bold text-gray-900 leading-tight">Siap Siaga Lapor</h3>
              <p className="text-xs text-gray-500">Laporkan insiden bencana atau keadaan darurat di sekitar Anda</p>
            </div>
          </div>
          <button
            onClick={() => !submitting && onClose()}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-200/60 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* 1. GPS Geolocation Status Card */}
          <div className="p-3.5 rounded-xl border transition-all duration-200 bg-gray-50/70 border-gray-200">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <MapPin size={16} className={gpsStatus === 'success' ? 'text-emerald-600' : 'text-brand-red'} />
                <span className="text-xs font-bold text-gray-800">Koordinat Lokasi GPS</span>
              </div>

              <button
                type="button"
                onClick={getGpsPosition}
                disabled={gpsStatus === 'searching'}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-red hover:underline disabled:opacity-50"
              >
                <RefreshCw size={11} className={gpsStatus === 'searching' ? 'animate-spin' : ''} />
                {gpsStatus === 'searching' ? 'Mendeteksi...' : 'Pindai Ulang'}
              </button>
            </div>

            {/* GPS Feedback Status */}
            <div className="mt-2 text-xs">
              {gpsStatus === 'searching' && (
                <div className="flex items-center gap-2 text-gray-600 bg-white p-2 rounded-lg border border-gray-200">
                  <Loader2 size={14} className="animate-spin text-brand-red shrink-0" />
                  <span>Mengakses modul GPS perangkat untuk mendeteksi koordinat Anda...</span>
                </div>
              )}

              {gpsStatus === 'success' && (
                <div className="flex items-start gap-2 text-emerald-800 bg-emerald-50 p-2.5 rounded-lg border border-emerald-200">
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-emerald-900">GPS Terdeteksi Akurat</p>
                    <p className="text-[11px] text-emerald-700 font-mono mt-0.5">
                      Lat: {coords.latitude?.toFixed(6)}, Lng: {coords.longitude?.toFixed(6)}
                    </p>
                  </div>
                </div>
              )}

              {(gpsStatus === 'denied' || gpsStatus === 'error') && (
                <div className="flex items-start gap-2 text-amber-800 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
                  <AlertTriangle size={16} className="text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-amber-900">GPS Belum Aktif / Ditolak</p>
                    <p className="text-[11px] text-amber-700 mt-0.5 leading-relaxed">
                      {gpsErrorMsg || 'Pastikan GPS dan izin lokasi peramban aktif untuk akurasi peta mitigasi.'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 2. Jenis Bencana */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              Jenis Insiden Bencana <span className="text-red-500">*</span>
            </label>
            <select
              value={disasterType}
              onChange={(e) => setDisasterType(e.target.value)}
              className="w-full text-xs font-medium bg-white border border-gray-300 rounded-xl px-3 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red"
            >
              {DISASTER_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* 3. Lokasi Kejadian (Teks / Patokan) */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              Patokan Alamat / Nama Lokasi <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Jl. Kopo Sayati No. 45 / Jembatan Citarum Dayeuhkolot"
              value={locationText}
              onChange={(e) => setLocationText(e.target.value)}
              className="w-full text-xs border border-gray-300 rounded-xl px-3.5 py-2.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red"
            />
          </div>

          {/* 4. Deskripsi Kejadian */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              Deskripsi Situasi Lapangan <span className="text-gray-400 font-normal">(Ketinggian air, dampak, korban, dll)</span>
            </label>
            <textarea
              rows={3}
              placeholder="Jelaskan kondisi secara ringkas dan padat untuk memudahkan proses penanganan petugas..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full text-xs border border-gray-300 rounded-xl p-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red resize-none leading-relaxed"
            />
          </div>

          {/* 5. Foto Bukti Kejadian */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              Foto Bukti Kejadian <span className="text-gray-400 font-normal">(Opsional / Sangat Dianjurkan)</span>
            </label>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="hidden"
            />

            {photoPreview ? (
              <div className="relative rounded-xl overflow-hidden border border-gray-200 bg-gray-100 h-40">
                <img src={photoPreview} alt="Bukti Kejadian" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="absolute top-2 right-2 bg-black/70 text-white rounded-full p-1.5 hover:bg-red-600 transition"
                  title="Hapus Foto"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 hover:border-brand-red/50 rounded-xl p-4 text-center cursor-pointer bg-gray-50/60 hover:bg-red-50/20 transition flex flex-col items-center justify-center gap-1"
              >
                <UploadCloud className="text-gray-400" size={26} />
                <p className="text-xs text-gray-700 font-semibold">
                  <span className="text-brand-red">Klik untuk unggah</span> atau ambil foto langsung
                </p>
                <p className="text-[10px] text-gray-400">JPG, PNG, WEBP (Maksimal 10MB)</p>
              </div>
            )}
          </div>

          {/* Info Status Menunggu */}
          <div className="p-3 bg-blue-50/80 rounded-xl border border-blue-100 flex items-start gap-2 text-[11px] text-blue-900">
            <Compass size={14} className="text-blue-600 shrink-0 mt-0.5" />
            <span>
              Laporan yang Anda kirimkan akan masuk ke antrean <b>Verifikasi Admin</b> terlebih dahulu sebelum diteruskan ke peta publik.
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-gray-100">
            <button
              type="button"
              disabled={submitting}
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-brand-red hover:bg-red-700 rounded-xl shadow-sm transition disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 size={14} className="animate-spin" /> Mengirim Laporan...
                </>
              ) : (
                'Kirim Laporan Bencana'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}