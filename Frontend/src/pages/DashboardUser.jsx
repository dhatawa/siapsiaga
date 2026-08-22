import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  Thermometer,
  Droplets,
  CloudRain,
  Cloud,
  CloudLightning,
  MapPin,
  Calendar,
  X,
  ExternalLink,
  ShieldCheck,
  Radio,
  Flame,
  Activity,
  Waves
} from 'lucide-react';
import DashboardNavbar from '../components/DashboardNavbar';
import AlertCard from '../components/AlertCard';
import ChatbotPopup, { ChatbotToggleButton } from '../components/ChatbotPopup';
import DisasterMap from '../components/DisasterMap';
import { useAuth } from '../context/AuthContext';
import { reportService } from '../services/reportService';

const fallbackAlerts = [
  {
    icon: AlertTriangle,
    title: 'Siaga Banjir',
    time: '10 mnt lalu',
    description:
      'Tinggi muka air Sungai Citarum mencapai status Siaga 2. Warga Kopo bantaran sungai harap waspada.',
    color: 'red',
  },
  {
    icon: Cloud,
    title: 'Angin Kencang',
    time: '1 jam lalu',
    description:
      'Peringatan dini angin kencang di area Kopo terutama Cibolerang dengan kecepatan hingga 40 km/jam.',
    color: 'yellow',
  },
];

const forecast = [
  { time: 'Sekarang', icon: CloudRain, label: 'Hujan' },
  { time: '15:00', icon: Cloud, label: 'Berawan' },
  { time: '18:00', icon: CloudLightning, label: 'Badai' },
];

export default function DashboardUser() {
  const [chatOpen, setChatOpen] = useState(false);
  const { user } = useAuth();
  const [validatedReports, setValidatedReports] = useState([]);
  const [selectedReportPreview, setSelectedReportPreview] = useState(null);

  const userName = user?.name ? user.name.split(' ')[0] : 'Pengguna';

  useEffect(() => {
    async function loadReports() {
      try {
        const data = await reportService.getPublicReports();
        setValidatedReports(data || []);
      } catch (err) {
        console.warn('Failed to load validated reports:', err);
      }
    }
    loadReports();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <DashboardNavbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          Selamat Datang Kembali, {userName} <span>👋</span>
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Berikut kondisi cuaca, pemantauan sensor, dan laporan insiden terkini di sekitar Anda.
        </p>

        <div className="grid lg:grid-cols-3 gap-5 mt-6">
          {/* Interactive Disaster & Sensor Map */}
          <div className="lg:col-span-2">
            <DisasterMap
              mode="user"
              height="480px"
              onSelectReport={(report) => setSelectedReportPreview(report)}
            />
          </div>

          {/* Right column: Sensor, Risk, & Weather Info */}
          <div className="flex flex-col gap-5">
            {/* Status Risiko Card */}
            <div className="bg-white rounded-xl border border-red-100 shadow-sm p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-gray-800">Status Risiko Lingkungan</p>
                <AlertTriangle size={16} className="text-red-500" />
              </div>
              <p className="text-2xl font-extrabold text-red-600 mt-1">Siaga Sedang - Tinggi</p>
              <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                {validatedReports.length > 0
                  ? `Terdapat ${validatedReports.length} laporan insiden bencana yang telah terverifikasi oleh petugas di wilayah sekitar.`
                  : 'Potensi genangan air di beberapa wilayah cekungan akibat curah hujan tinggi.'}
              </p>
              <Link to="/edukasi" className="text-xs text-primary-700 font-semibold hover:underline mt-2 inline-block">
                Lihat Panduan Mitigasi →
              </Link>
            </div>

            {/* Weather & Sensor Sensor Overview */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-400 flex items-center gap-1">
                    <Thermometer size={13} /> SUHU
                  </p>
                  <p className="text-lg font-bold text-gray-900 mt-1">29°C</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 flex items-center gap-1">
                    <Droplets size={13} /> KELEMBAPAN
                  </p>
                  <p className="text-lg font-bold text-gray-900 mt-1">82%</p>
                </div>
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-500">Kondisi : Hujan Ringan</p>
                <Link to="/prediksi-cuaca" className="text-xs text-primary-700 font-semibold hover:underline">
                  Detail Cuaca →
                </Link>
              </div>
            </div>

            {/* Prediksi Cuaca Mini */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-gray-800">Prakiraan Cuaca</p>
                <Link to="/prediksi-cuaca" className="text-xs text-primary-700 font-medium hover:underline">
                  Detail →
                </Link>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                {forecast.map(({ time, icon: Icon, label }) => (
                  <div key={time}>
                    <p className="text-[11px] text-gray-400">{time}</p>
                    <Icon size={22} className="mx-auto my-1.5 text-primary-600" />
                    <p className="text-[11px] text-gray-600">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Peringatan Aktif & Laporan Insiden Terkini */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2">
              <AlertTriangle size={16} className="text-brand-red" /> Peringatan Aktif
            </h2>
          </div>

          {/* <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {validatedReports.length > 0 ? (
              validatedReports.map((r) => (
                <div
                  key={r.id}
                  onClick={() => setSelectedReportPreview(r)}
                  className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase bg-red-50 text-brand-red border border-red-200">
                        {r.disaster_type.replace('_', ' ')}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        {new Date(r.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>

                    <h3 className="text-xs font-bold text-gray-900 line-clamp-1">{r.location_text}</h3>
                    <p className="text-[11px] text-gray-500 line-clamp-2 mt-1 leading-relaxed">{r.description || 'Laporan insiden warga.'}</p>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between text-[11px]">
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      <ShieldCheck size={12} /> Terverifikasi
                    </span>
                    <span className="text-brand-red font-bold hover:underline">Detail →</span>
                  </div>
                </div>
              ))
            ) : (
              fallbackAlerts.map((a) => <AlertCard key={a.title} {...a} />)
            )}
          </div> */}
        </div>
      </main>

      {/* Modal Preview Detail Laporan dari Peta */}
      {selectedReportPreview && (
        <div
          onClick={() => setSelectedReportPreview(null)}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95"
          >
            <div className="px-5 py-3.5 bg-gray-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-red uppercase">
                  {selectedReportPreview.disaster_type?.replace('_', ' ')}
                </span>
                <span className="text-xs text-gray-200 truncate max-w-xs">
                  {selectedReportPreview.location_text}
                </span>
              </div>
              <button
                onClick={() => setSelectedReportPreview(null)}
                className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-5 space-y-3.5 max-h-[80vh] overflow-y-auto">
              {selectedReportPreview.photo_url && (
                <div className="rounded-xl overflow-hidden bg-gray-100 max-h-56">
                  <img
                    src={selectedReportPreview.photo_url}
                    alt="Bukti Kejadian"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div>
                <h3 className="text-sm font-bold text-gray-900">{selectedReportPreview.location_text}</h3>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  Dilaporkan pada{' '}
                  {new Date(selectedReportPreview.created_at).toLocaleString('id-ID', {
                    dateStyle: 'medium',
                    timeStyle: 'short'
                  })}{' '}
                  WIB
                </p>
              </div>

              {selectedReportPreview.latitude && selectedReportPreview.longitude && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs">
                  <span className="font-mono text-emerald-800 text-[11px]">
                    Lat: {parseFloat(selectedReportPreview.latitude).toFixed(5)}, Lng: {parseFloat(selectedReportPreview.longitude).toFixed(5)}
                  </span>
                  <a
                    href={`https://www.google.com/maps?q=${selectedReportPreview.latitude},${selectedReportPreview.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-700 font-bold hover:underline flex items-center gap-1 text-[11px]"
                  >
                    Google Maps <ExternalLink size={11} />
                  </a>
                </div>
              )}

              <div className="text-xs text-gray-700 leading-relaxed whitespace-pre-line p-3 bg-gray-50 rounded-xl border border-gray-100">
                {selectedReportPreview.description || 'Tidak ada deskripsi detail tambahan.'}
              </div>
            </div>

            <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setSelectedReportPreview(null)}
                className="px-4 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-100 transition"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="bg-white border-t border-gray-100 mt-auto">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-gray-400">
          <div>
            <p className="font-bold text-brand-red text-sm">Siap Siaga</p>
            <p>© 2026 Siap Siaga - Sistem Informasi Mitigasi Bencana Indonesia</p>
          </div>
          <div className="flex gap-5">
            <a href='tes'>Kontak Darurat</a>
            <span>Peta Risiko</span>
            <span>Tentang Kami</span>
            <span>Kebijakan Privasi</span>
          </div>
        </div>
      </footer>

      <ChatbotToggleButton onClick={() => setChatOpen((v) => !v)} />
      <ChatbotPopup open={chatOpen} onClose={() => setChatOpen(false)} />
    </div>
  );
}
