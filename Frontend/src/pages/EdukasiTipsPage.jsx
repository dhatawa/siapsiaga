import { Link } from 'react-router-dom';
import { FileText, Waves, Home, Flame, Play, Printer, ClipboardList } from 'lucide-react';
import DashboardNavbar from '../components/DashboardNavbar';
import DashboardFooter from '../components/DashboardFooter';
import PageWithChatbot from '../components/PageWithChatbot';

const cards = [
  {
    slug: 'gempa-bumi',
    icon: FileText,
    title: 'Gempa Bumi',
    accent: 'border-l-red-500',
    iconBg: 'bg-red-600',
    desc: 'Indonesia berada di kawasan Cincin Api. Pahami teknik "Drop, Cover, and Hold On" (Merunduk, Berlindung, dan Bertahan) saat terjadi guncangan.',
    tips: [
      { title: 'Siapkan Tas Siaga Bencana', desc: 'Air, makanan tahan lama, P3K, senter.' },
      { title: 'Ketahui Jalur Evakuasi', desc: 'Identifikasi tempat aman di luar ruangan.' },
    ],
  },
  {
    slug: 'tsunami',
    icon: Waves,
    title: 'Tsunami',
    accent: 'border-l-blue-500',
    iconBg: 'bg-primary-700',
    desc: 'Waspadai gempa kuat di dekat pantai atau surutnya air laut secara tiba-tiba. Segera menjauh menuju daratan tinggi.',
    note: 'Jangan menunggu peringatan resmi jika terasa gempa kuat.',
  },
  {
    slug: 'banjir',
    icon: Home,
    title: 'Banjir',
    accent: 'border-l-red-500',
    iconBg: 'bg-primary-700',
    desc: 'Pindahkan barang berharga ke tempat yang lebih tinggi. Matikan aliran listrik dari meteran utama jika air mulai masuk rumah.',
  },
  {
    slug: 'kebakaran',
    icon: Flame,
    title: 'Kebakaran',
    accent: 'border-l-red-500',
    iconBg: 'bg-red-600',
    desc: 'Pahami penggunaan APAR (Alat Pemadam Api Ringan). Gunakan rute evakuasi terdekat, jangan gunakan lift.',
  },
];

const checklist = [
  'Air Minum (3 Hari)',
  'Makanan Tahan Lama',
  'Kotak P3K',
  'Senter & Baterai Cadangan',
  'Dokumen Penting (Plastik)',
  'Pakaian Ganti',
  'Peluit Darurat',
  'Uang Tunai secukupnya',
];

export default function EdukasiTipsPage() {
  return (
    <PageWithChatbot>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <DashboardNavbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-gray-900">Panduan Keselamatan & Mitigasi</h1>
        <p className="text-sm text-gray-500 mt-1 max-w-2xl">
          Pelajari langkah-langkah penting untuk melindungi diri dan keluarga sebelum, saat, dan
          setelah bencana terjadi. Pengetahuan adalah pertahanan terbaik kita.
        </p>

        <div className="grid md:grid-cols-2 gap-5 mt-6">
          {cards.map((c) => (
            <div
              key={c.slug}
              className={`bg-blue-50/60 border-l-4 ${c.accent} rounded-lg p-5`}
            >
              <div className="flex items-center gap-2 mb-3">
                <span className={`w-7 h-7 rounded-md ${c.iconBg} text-white flex items-center justify-center`}>
                  <c.icon size={14} />
                </span>
                <p className="font-semibold text-gray-900 text-sm">{c.title}</p>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">{c.desc}</p>

              {c.tips && (
                <div className="grid grid-cols-2 gap-3 mt-4">
                  {c.tips.map((t) => (
                    <div key={t.title} className="bg-white rounded-md p-2.5 text-xs">
                      <p className="font-medium text-gray-800">{t.title}</p>
                      <p className="text-gray-400 text-[11px] mt-0.5">{t.desc}</p>
                    </div>
                  ))}
                </div>
              )}

              {c.note && (
                <p className="text-[11px] text-gray-400 mt-4 flex items-center gap-1">
                  ⚠ {c.note}
                </p>
              )}

              <Link
                to={`/edukasi/${c.slug}`}
                className="text-xs text-primary-700 font-medium hover:underline mt-4 inline-block"
              >
                Baca Panduan Lengkap →
              </Link>
            </div>
          ))}

          <Link
            to="/edukasi/video"
            className="relative rounded-lg overflow-hidden bg-gradient-to-br from-gray-700 to-gray-900 min-h-[180px] flex flex-col items-center justify-center text-center text-white group"
          >
            <span className="w-12 h-12 rounded-full border-2 border-white/70 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Play size={18} className="ml-0.5" />
            </span>
            <p className="font-semibold text-sm">Video Tutorial Mitigasi</p>
            <p className="text-xs text-white/70 mt-1">Tonton panduan visual langkah demi langkah.</p>
            <span className="mt-4 bg-primary-700 text-xs font-medium px-4 py-1.5 rounded-md">
              Lihat Koleksi
            </span>
          </Link>
        </div>

        {/* Checklist */}
        <div className="bg-blue-50/60 rounded-xl p-6 mt-6">
          <div className="flex items-start justify-between flex-wrap gap-3">
            <div>
              <p className="font-semibold text-gray-900 text-sm flex items-center gap-2">
                <ClipboardList size={16} className="text-primary-700" />
                Checklist Tas Siaga Bencana
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Siapkan kebutuhan dasar untuk bertahan hidup 3x24 jam.
              </p>
            </div>
            <button className="flex items-center gap-1.5 text-xs font-medium bg-white border border-gray-200 px-3 py-1.5 rounded-md text-gray-700 hover:bg-gray-50">
              <Printer size={13} /> Cetak Checklist
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-3 mt-5">
            {checklist.map((item) => (
              <label key={item} className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
                <input type="checkbox" className="rounded border-gray-300 text-primary-700 focus:ring-primary-700/40" />
                {item}
              </label>
            ))}
          </div>
        </div>
      </main>

      <DashboardFooter />
    </div>
  </PageWithChatbot>
  );
}
