import { Link } from 'react-router-dom';
import { LayoutDashboard, BellRing, BookOpenCheck, Database, BrainCircuit, Radio, ShieldCheck } from 'lucide-react';
import PublicNavbar from '../components/PublicNavbar';

const features = [
  {
    icon: LayoutDashboard,
    title: 'Dashboard Interaktif',
    desc: 'Pantau situasi di sekitar Anda melalui visualisasi data real-time yang mudah dipahami.',
  },
  {
    icon: BellRing,
    title: 'Peringatan Dini',
    desc: 'Terima notifikasi otomatis saat potensi bencana terdeteksi di sekitar area Anda.',
  },
  {
    icon: BookOpenCheck,
    title: 'Edukasi & Panduan',
    desc: 'Pelajari langkah-langkah mitigasi dan tindakan darurat yang tepat sebelum bencana terjadi.',
  },
];

const steps = [
  { icon: Database, title: 'Pengumpulan Data', desc: 'Sensor IoT di lapangan mengumpulkan data lingkungan secara real-time.' },
  { icon: BrainCircuit, title: 'Analisis AI', desc: 'Data diproses dan dianalisis untuk mendeteksi potensi risiko bencana.' },
  { icon: Radio, title: 'Penyebaran Info', desc: 'Peringatan dini disebarluaskan ke masyarakat yang terdampak.' },
  { icon: ShieldCheck, title: 'Panduan Mitigasi', desc: 'Pengguna mendapatkan panduan langkah mitigasi yang tepat dan cepat.' },
];

const stats = [
  { value: '98.5%', label: 'Akurasi Prediksi' },
  { value: '15', label: 'Titik Monitor Aktif' },
  { value: '50', label: 'Peringatan Aktif' },
  { value: '24/7', label: 'Pemantauan Sistem' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <PublicNavbar />

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
            Mitigasi Cepat, <br /> Keselamatan Terjaga
          </h1>
          <p className="mt-5 text-gray-500 leading-relaxed max-w-md">
            Sistem informasi mitigasi bencana real-time terpercaya. Dapatkan informasi terkini,
            peringatan dini, dan panduan keselamatan langsung di tangan Anda.
          </p>
          <Link
            to="/register"
            className="inline-block mt-7 bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-6 py-3 rounded-lg transition-colors"
          >
            Mulai Sekarang
          </Link>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3">
          <div className="rounded-xl overflow-hidden h-72 bg-gradient-to-br from-red-50 to-rose-100 flex items-center justify-center text-red-300 text-sm font-medium">
            Peta Interaktif
          </div>
        </div>
      </section>

      {/* Fitur Utama */}
      <section id="fitur" className="max-w-7xl mx-auto px-6 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Fitur Utama</h2>
        <p className="text-gray-500 mt-2 max-w-lg mx-auto text-sm">
          Semua yang Anda butuhkan untuk tetap siaga dan aman dalam satu platform terintegrasi.
        </p>

        <div className="grid md:grid-cols-3 gap-6 mt-10 text-left">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <div className="w-10 h-10 rounded-lg bg-red-600 text-white flex items-center justify-center mb-4">
                <Icon size={18} />
              </div>
              <h3 className="font-semibold text-gray-900">{title}</h3>
              <p className="text-sm text-gray-500 mt-2 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Cara Kerja */}
      <section id="cara-kerja" className="max-w-7xl mx-auto px-6 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Bagaimana Siap Siaga Bekerja</h2>
        <p className="text-gray-500 mt-2 max-w-lg mx-auto text-sm">
          Sistem terintegrasi yang bekerja secara otomatis untuk melindungi masyarakat.
        </p>

        <div className="grid md:grid-cols-4 gap-6 mt-10">
          {steps.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center mb-4">
                <Icon size={20} />
              </div>
              <h3 className="font-semibold text-gray-900 text-sm">{title}</h3>
              <p className="text-xs text-gray-500 mt-2 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Status */}
      <section id="status" className="max-w-7xl mx-auto px-6 pb-16">
        <h2 className="text-2xl font-bold text-gray-900">Status</h2>
        <div className="rounded-2xl border  py-10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map(({ value, label }) => (
            <div key={label}>
              <p className="text-3xl font-extrabold text-red-600">{value}</p>
              <p className="text-xs text-red-500 mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-8 text-sm">
          <div>
            <p className="font-bold text-brand-red text-lg">Siap Siaga</p>
            <p className="text-gray-500 mt-2 leading-relaxed max-w-xs">
              Platform informasi mitigasi bencana Indonesia untuk masyarakat yang lebih siap dan tanggap.
            </p>
          </div>
          <div>
            <p className="font-semibold text-gray-900 mb-3">Sumber Penting</p>
            <ul className="space-y-2 text-gray-500">
              <li>Kontak Darurat</li>
              <li>Peta Risiko</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-gray-900 mb-3">Informasi</p>
            <ul className="space-y-2 text-gray-500">
              <li>Tentang Kami</li>
              <li>Kebijakan Privasi</li>
            </ul>
          </div>
        </div>
        <div className="text-center text-xs text-gray-400 pb-6">
          © 2026 Siap Siaga - Sistem Informasi Mitigasi Bencana Indonesia
        </div>
      </footer>
    </div>
  );
}
