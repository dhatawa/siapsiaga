import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Thermometer, Droplets, CloudRain, Cloud, CloudLightning } from 'lucide-react';
import DashboardNavbar from '../components/DashboardNavbar';
import AlertCard from '../components/AlertCard';
import ChatbotPopup, { ChatbotToggleButton } from '../components/ChatbotPopup';

const alerts = [
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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <DashboardNavbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          Selamat Pagi, Farid <span>👋</span>
        </h1>
        <p className="text-sm text-gray-500 mt-1">Berikut kondisi terkini disekitar anda</p>

        <div className="grid lg:grid-cols-3 gap-5 mt-6">
          {/* Map */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden h-[340px] relative">
            <div className="absolute top-3 left-3 bg-white text-xs px-3 py-1.5 rounded-md shadow flex items-center gap-1.5 z-10">
              <span className="w-2 h-2 rounded-full bg-primary-700 inline-block" />
              Sensor Terdekat : Kopo
            </div>
            <div className="w-full h-full bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center text-gray-300 text-sm">
              Peta Interaktif (Leaflet / Google Maps)
            </div>
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-5">
            <div className="bg-white rounded-xl border border-red-100 shadow-sm p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-gray-800">Status Risiko</p>
                <AlertTriangle size={16} className="text-red-500" />
              </div>
              <p className="text-2xl font-extrabold text-red-600 mt-1">Tinggi</p>
              <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                Potensi banjir di beberapa wilayah akibat curah hujan tinggi.
              </p>
              <a href="#" className="text-xs text-primary-700 font-medium hover:underline mt-2 inline-block">
                Lihat Analisis AI →
              </a>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-400 flex items-center gap-1">
                    <Thermometer size={13} /> SUHU
                  </p>
                  <p className="text-lg font-bold text-gray-900 mt-1">32°C</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 flex items-center gap-1">
                    <Droplets size={13} /> KELEMBAPAN
                  </p>
                  <p className="text-lg font-bold text-gray-900 mt-1">78%</p>
                </div>
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-400">Curah Hujan : Tinggi</p>
                <Link to="/sensor/kopo" className="text-xs text-primary-700 font-medium hover:underline">
                  Lihat Detail Sensor →
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-gray-800">Prediksi Cuaca</p>
                <Link to="/prediksi-cuaca" className="text-xs text-primary-700 font-medium hover:underline">Detail →</Link>
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

        {/* Peringatan Aktif */}
        <div className="mt-8">
          <h2 className="text-sm font-semibold text-gray-800 mb-3">Peringatan Aktif</h2>
          <div className="flex flex-col md:flex-row gap-4">
            {alerts.map((a) => (
              <AlertCard key={a.title} {...a} />
            ))}
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-gray-400">
          <div>
            <p className="font-bold text-brand-red text-sm">Siap Siaga</p>
            <p>© 2026 Siap Siaga - Sistem Informasi Mitigasi Bencana Indonesia</p>
          </div>
          <div className="flex gap-5">
            <span>Kontak Darurat</span>
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
