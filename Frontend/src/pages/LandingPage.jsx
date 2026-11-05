import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, BellRing, BookOpenCheck, Database, BrainCircuit, Radio, ShieldCheck, CheckCircle, ChevronLeft, ChevronRight, Maximize2, X, Activity, Layers } from 'lucide-react';
import PublicNavbar from '../components/PublicNavbar';
import SijanSmartShowcase from '../components/SijanSmartShowcase';
import DisasterMap from '../components/DisasterMap';

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
];

export default function LandingPage() {
  const [isMapExpanded, setIsMapExpanded] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsMapExpanded(false);
    };
    if (isMapExpanded) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isMapExpanded]);
  useEffect(() => {
    const sections = document.querySelectorAll('.fade-in-element');
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18 }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const [stepIndex, setStepIndex] = useState(0);
  const visibleSteps = steps.slice(stepIndex, stepIndex + 2);
  const hasPrev = stepIndex > 0;
  const hasNext = stepIndex + 2 < steps.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <PublicNavbar />

      {/* Hero */}
      <section id="dashboard" className="fade-in-element max-w-3xl mx-auto px-6 py-20 text-center">
        <div className="inline-flex flex-col items-center gap-3 rounded-full border border-red-200 bg-white/90 px-5 py-3 text-sm font-medium text-red-700 shadow-sm shadow-red-100 sm:flex-row sm:gap-4">
          <span className="rounded-full bg-red-600 px-3 py-1 text-xs uppercase tracking-[0.24em] text-white">Terbaru</span>
          <span>Platform mitigasi bencana siap pakai untuk masyarakat dan petugas lapangan berbasis AI + IOT.</span>
        </div>

        <h1 className="mt-8 text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight">
          Mitigasi cepat, keputusan lebih siap.
        </h1>
        <p className="mx-auto mt-6 text-base sm:text-lg md:text-lg text-gray-600 max-w-2xl leading-relaxed">
          Dapatkan peringatan dini, panduan mitigasi, dan informasi situasi real-time dalam satu platform yang mudah digunakan.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            to="/register"
            className="button-scale inline-flex items-center justify-center rounded-full bg-red-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-red-200 transition-colors duration-200 hover:bg-red-700"
          >
            Mulai Sekarang
          </Link>
          <Link
            to="/fitur"
            className="button-scale inline-flex items-center justify-center rounded-full border border-red-600 bg-white px-6 py-3 text-sm font-semibold text-red-600 transition-colors duration-200 hover:border-red-700 hover:text-red-700"
          >
            Lihat Fitur
          </Link>
        </div>
      </section>

      {/* Fitur Utama */}
      <section id="fitur" className="fade-in-element max-w-6xl mx-auto px-6 py-16 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Alur Pelaporan Presisi</h2>
        <div className="mx-auto mt-4 h-1.5 w-24 rounded-full bg-red-600"></div>
        <p className="mx-auto mt-4 text-gray-500 max-w-2xl text-sm sm:text-base leading-relaxed">
          Lakukan pelaporan secara cepat dan tepat dengan alur yang jelas, validasi otomatis, serta update real-time.
        </p>

        <div className="relative mt-14">
          <div className="absolute inset-x-0 top-1/2 h-px bg-gray-200"></div>
          <div className="grid gap-8 md:grid-cols-3 relative">
            {features.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="group relative z-10 flex flex-col items-center gap-5 rounded-3xl border border-gray-100 bg-white px-6 py-8 shadow-sm transition-transform duration-300 hover:-translate-y-1"
              >
                <div className="button-scale flex h-14 w-14 items-center justify-center rounded-full bg-red-600 text-white transition-transform duration-200 group-hover:scale-110">
                  <Icon size={20} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Peta Pemantauan Geospasial Real-time (Sesuai Sketsa Kotak Merah & Teks Biru) */}
      <section id="peta" className="fade-in-element max-w-7xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Kolom Kiri: Gambaran Maps (Kotak Merah di Sketsa) */}
          <div className="lg:col-span-7 relative group">
            <div className="relative rounded-3xl overflow-hidden border border-gray-200/90 bg-white shadow-xl shadow-gray-200/60 p-2">
              <DisasterMap mode="public" height="460px" className="rounded-2xl" />
            </div>

            {/* Quick Expand Floating Button di pojok kanan atas peta */}
            <button
              type="button"
              onClick={() => setIsMapExpanded(true)}
              className="absolute top-5 right-5 z-20 button-scale bg-white/95 hover:bg-white text-gray-800 px-3 py-2 rounded-xl shadow-lg border border-gray-200 flex items-center gap-1.5 text-xs font-bold transition"
              title="Perbesar Peta Layar Penuh"
            >
              <Maximize2 size={15} className="text-brand-red" />
              <span className="hidden sm:inline">Perbesar</span>
            </button>
          </div>

          {/* Kolom Kanan: Penjelasan & Tombol Pembesar (Warna Biru di Sketsa) */}
          <div className="lg:col-span-5 text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50/90 px-4 py-1.5 text-xs font-bold text-red-700 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
              <span>Pemantauan Geospasial Real-time</span>
            </div>

            <h2 className="mt-5 text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
              Peta Pemantauan Wilayah & Potensi Risiko Bencana
            </h2>

            <p className="mt-4 text-sm sm:text-base text-gray-600 leading-relaxed">
              Pantau titik stasiun sensor IoT di lapangan, laporan kejadian bencana terverifikasi dari masyarakat, serta aktivitas gempa terkini BMKG secara presisi dalam satu peta terintegrasi.
            </p>

            {/* Highlight Fitur Peta */}
            <div className="mt-6 space-y-3.5">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-red-50 text-brand-red flex items-center justify-center shrink-0 mt-0.5">
                  <Radio size={16} />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">Sensor IoT Lapangan</p>
                  <p className="text-xs text-gray-500 mt-0.5">Deteksi ketinggian air, gempa, dan stasiun sensor cuaca secara langsung.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-red-50 text-brand-red flex items-center justify-center shrink-0 mt-0.5">
                  <Activity size={16} />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">Laporan Warga & BMKG Terkini</p>
                  <p className="text-xs text-gray-500 mt-0.5">Titik banjir, kebakaran, dan longsor tervalidasi lengkap dengan data gempa bumi.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-red-50 text-brand-red flex items-center justify-center shrink-0 mt-0.5">
                  <Layers size={16} />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">3 Mode Peta Interaktif</p>
                  <p className="text-xs text-gray-500 mt-0.5">Ganti mode Default jalanan, Citra Satelit, dan Terrain topografi sesuka Anda.</p>
                </div>
              </div>
            </div>

            {/* Tombol Perbesar Peta (Kotak/Pill Biru di Sketsa) */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setIsMapExpanded(true)}
                className="button-scale inline-flex items-center gap-2.5 rounded-full bg-red-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-red-200 transition-colors duration-200 hover:bg-red-700"
              >
                <Maximize2 size={18} />
                <span>Perbesar Peta Interaktif</span>
              </button>

              <Link
                to="/register"
                className="button-scale inline-flex items-center justify-center rounded-full border border-gray-200 bg-white px-5 py-3.5 text-sm font-semibold text-gray-700 shadow-xs transition hover:bg-gray-50"
              >
                Lapor Kejadian
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Cara Kerja */}
      <section id="cara-kerja" className="fade-in-element max-w-6xl mx-auto px-6 py-16 text-center">
        <div className="flex flex-col items-center gap-4 lg:flex-row lg:justify-between lg:items-end">
          <div className="text-left w-full lg:w-2/3 mx-auto lg:mx-0">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Alur Pelaporan</h2>
            <p className="mt-3 text-gray-500 max-w-2xl text-sm sm:text-base leading-relaxed">
              Ikuti langkah mudah untuk melaporkan kejadian secara presisi dan dapatkan tanggapan cepat.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setStepIndex((value) => Math.max(0, value - 2))}
              disabled={!hasPrev}
              className="button-scale inline-flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-sm transition duration-200 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={() => setStepIndex((value) => Math.min(steps.length - 2, value + 2))}
              disabled={!hasNext}
              className="button-scale inline-flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-sm transition duration-200 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {visibleSteps.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="group rounded-[2rem] border border-gray-100 bg-white p-6 text-left shadow-lg shadow-gray-100 transition-transform duration-300 hover:-translate-y-1"
            >
              <div className="button-scale inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-red-600 text-white transition-transform duration-200 group-hover:scale-110">
                <Icon size={22} />
              </div>
              <h3 className="mt-5 text-xl font-semibold text-gray-900">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-gray-500">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Perangkat IoT */}
      <section id="iot" className="fade-in-element">
        <div className="text-center max-w-7xl mx-auto px-6 pt-16 pb-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Perangkat IoT Siap Siaga</h2>
          <div className="mx-auto mt-4 h-1.5 w-24 rounded-full bg-red-600"></div>
          <p className="mx-auto mt-4 max-w-2xl text-sm sm:text-base text-gray-500 leading-relaxed">
            Kenali prototype sensor lapangan kami. Klik perangkat untuk membongkar casing dan melihat fungsi setiap komponennya.
          </p>
        </div>
        <SijanSmartShowcase />
      </section>

      {/* Status */}
      <section id="status" className="fade-in-element max-w-6xl mx-auto px-6 py-16">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Dashboard Transparansi</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm sm:text-base text-gray-500 leading-relaxed">
            Pantau kinerja perbaikan fasilitas secara real-time. Kami berkomitmen pada keterbukaan data setiap langkah.
          </p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {stats.map(({ value, label }) => (
            <div key={label} className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-lg shadow-gray-100 transition-transform duration-300 hover:-translate-y-1">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-red-50 text-red-600 shadow-sm">
                <CheckCircle size={20} />
              </div>
              <p className="mt-5 text-4xl font-extrabold text-red-600">{value}</p>
              <p className="mt-3 text-sm font-semibold uppercase tracking-[0.18em] text-gray-500">{label}</p>
              <div className="mt-5 h-1.5 w-full rounded-full bg-red-100">
                <div className="h-1.5 w-2/3 rounded-full bg-red-600"></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Fullscreen Map Modal */}
      {isMapExpanded && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-3 sm:p-6 animate-in fade-in duration-200">
          <div className="relative w-full max-w-7xl h-[92vh] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-gray-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-red-50 text-brand-red flex items-center justify-center">
                  <Layers size={20} />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 leading-tight">
                    Peta Pemantauan Geospasial Siap Siaga
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Mode Layar Penuh • Menampilkan stasiun sensor IoT, BMKG, dan laporan warga
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsMapExpanded(false)}
                  className="button-scale p-2 rounded-xl border border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition"
                  title="Tutup Peta Layar Penuh (Esc)"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Fullscreen Map Canvas */}
            <div className="flex-1 w-full relative">
              <DisasterMap mode="public" height="100%" className="w-full h-full rounded-none border-0 shadow-none" />
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="fade-in-element bg-white border-t border-gray-100">
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
