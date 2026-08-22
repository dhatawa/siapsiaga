import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Waves,
  Home,
  Flame,
  Play,
  Printer,
  ClipboardList,
  ShieldAlert,
  Loader2,
  Sparkles,
  ArrowRight,
  BookOpen
} from 'lucide-react';
import DashboardNavbar from '../components/DashboardNavbar';
import DashboardFooter from '../components/DashboardFooter';
import PageWithChatbot from '../components/PageWithChatbot';
import { contentService } from '../services/contentService';

const fallbackCards = [
  {
    slug: 'gempa-bumi',
    category: 'Gempa Bumi',
    title: 'Panduan Keselamatan Gempa Bumi',
    body: 'Indonesia berada di kawasan Cincin Api. Pahami teknik "Drop, Cover, and Hold On" (Merunduk, Berlindung, dan Bertahan) saat terjadi guncangan.',
  },
  {
    slug: 'tsunami',
    category: 'Tsunami',
    title: 'Panduan Keselamatan Tsunami',
    body: 'Waspadai gempa kuat di dekat pantai atau surutnya air laut secara tiba-tiba. Segera menjauh menuju daratan tinggi tanpa menunggu peringatan resmi.',
  },
  {
    slug: 'banjir',
    category: 'Banjir',
    title: 'Panduan Mitigasi Banjir',
    body: 'Pindahkan barang berharga ke tempat yang lebih tinggi. Matikan aliran listrik dari meteran utama jika air mulai memasuki tempat tinggal.',
  },
  {
    slug: 'kebakaran',
    category: 'Kebakaran',
    title: 'Panduan Keselamatan Kebakaran & Penggunaan APAR',
    body: 'Pahami teknik pemadaman T.A.T.A / PASS (Tarik, Arahkan, Tekan, Ayunkan) dan rute evakuasi darurat tanpa menggunakan lift.',
  },
];

const checklist = [
  'Air Minum (3 Hari)',
  'Makanan Tahan Lama',
  'Kotak P3K & Obat Khusus',
  'Senter & Baterai Cadangan',
  'Dokumen Penting (Plastik Kedap)',
  'Pakaian Ganti & Selimut',
  'Peluit Darurat & Korek Api',
  'Uang Tunai Secukupnya',
];

export default function EdukasiTipsPage() {
  const [dbArticles, setDbArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadArticles() {
      try {
        setLoading(true);
        const data = await contentService.getPublicContents({ type: 'artikel' });
        setDbArticles(data || []);
      } catch (err) {
        console.error('Failed to load dynamic articles:', err);
      } finally {
        setLoading(false);
      }
    }
    loadArticles();
  }, []);

  const articlesToDisplay = dbArticles.length > 0 ? dbArticles : fallbackCards;

  const getCategoryIcon = (category = '') => {
    const cat = category.toLowerCase();
    if (cat.includes('gempa')) return { icon: FileText, color: 'bg-red-600', border: 'border-l-red-500' };
    if (cat.includes('tsunami')) return { icon: Waves, color: 'bg-blue-600', border: 'border-l-blue-500' };
    if (cat.includes('banjir')) return { icon: Home, color: 'bg-cyan-600', border: 'border-l-cyan-500' };
    if (cat.includes('kebakaran') || cat.includes('api')) return { icon: Flame, color: 'bg-orange-600', border: 'border-l-orange-500' };
    return { icon: ShieldAlert, color: 'bg-brand-red', border: 'border-l-red-500' };
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <PageWithChatbot>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <DashboardNavbar />

        <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
          {/* Header Banner */}
          <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-red-50 text-brand-red">
                  <BookOpen size={22} />
                </span>
                <h1 className="text-2xl font-bold text-gray-900">Panduan Keselamatan & Mitigasi</h1>
              </div>
              <p className="text-sm text-gray-500 mt-1 max-w-2xl ml-10">
                Pelajari langkah-langkah penting untuk melindungi diri dan keluarga sebelum, saat, dan
                setelah bencana terjadi. Pengetahuan adalah pertahanan terbaik kita.
              </p>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid md:grid-cols-2 gap-5 mt-4">
            {loading ? (
              <div className="md:col-span-2 py-12 flex flex-col items-center justify-center bg-white rounded-2xl border border-gray-100">
                <Loader2 className="w-7 h-7 text-brand-red animate-spin mb-2" />
                <p className="text-xs text-gray-500">Memuat materi panduan edukasi...</p>
              </div>
            ) : (
              articlesToDisplay.map((c) => {
                const style = getCategoryIcon(c.category);
                const IconComponent = style.icon;

                return (
                  <div
                    key={c.slug || c.id}
                    className={`bg-white border-l-4 ${style.border} rounded-xl p-5 shadow-sm border border-gray-100/80 hover:shadow-md transition-all flex flex-col justify-between`}
                  >
                    <div>
                      {/* Image Thumbnail if Available */}
                      {c.thumbnail_url && (
                        <div className="mb-4 h-36 rounded-lg overflow-hidden bg-gray-100">
                          <img
                            src={c.thumbnail_url}
                            alt={c.title}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}

                      <div className="flex items-center gap-2.5 mb-2.5">
                        <span
                          className={`w-7 h-7 rounded-lg ${style.color} text-white flex items-center justify-center shadow-sm shrink-0`}
                        >
                          <IconComponent size={14} />
                        </span>
                        <div>
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                            {c.category}
                          </span>
                          <p className="font-bold text-gray-900 text-sm leading-snug">{c.title}</p>
                        </div>
                      </div>

                      <p className="text-xs text-gray-600 leading-relaxed line-clamp-3 mt-2">
                        {c.body ? c.body.replace(/[#*`_]/g, '') : ''}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-[11px] text-gray-400">
                        {c.updated_at
                          ? `Diperbarui ${new Date(c.updated_at).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'short'
                            })}`
                          : 'Panduan Resmi SiapSiaga'}
                      </span>
                      <Link
                        to={`/edukasi/${c.slug}`}
                        className="text-xs text-primary-700 font-bold hover:text-red-700 flex items-center gap-1 group"
                      >
                        Baca Panduan Lengkap{' '}
                        <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                );
              })
            )}

            {/* Banner Promo Video Tutorial */}
            <Link
              to="/edukasi/video"
              className="relative rounded-xl overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-950 min-h-[200px] p-6 flex flex-col items-center justify-center text-center text-white group shadow-sm hover:shadow-md transition-all md:col-span-2 lg:col-span-1"
            >
              <span className="w-14 h-14 rounded-full bg-white/20 backdrop-blur border-2 border-white/70 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-lg">
                <Play size={20} className="ml-1 text-white fill-white" />
              </span>
              <p className="font-bold text-base">Koleksi Video Tutorial Mitigasi</p>
              <p className="text-xs text-white/80 mt-1 max-w-sm">
                Tonton panduan visual interaktif dan langkah demi langkah simulasi tanggap darurat bencana.
              </p>
              <span className="mt-4 bg-brand-red hover:bg-red-700 text-xs font-bold px-4 py-2 rounded-lg transition">
                Buka Galeri Video →
              </span>
            </Link>
          </div>

          {/* Checklist Tas Siaga Bencana */}
          {/* <div className="bg-blue-50/70 border border-blue-100 rounded-2xl p-6 mt-8 shadow-sm">
            <div className="flex items-start justify-between flex-wrap gap-3">
              <div>
                <p className="font-bold text-gray-900 text-base flex items-center gap-2">
                  <ClipboardList size={18} className="text-primary-700" />
                  Checklist Tas Siaga Bencana (Emergency Grab-Bag)
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  Siapkan kebutuhan dasar untuk bertahan hidup mandiri minimal 3x24 jam dalam kondisi evakuasi.
                </p>
              </div>
              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 text-xs font-semibold bg-white border border-gray-200 px-3.5 py-2 rounded-xl text-gray-700 hover:bg-gray-50 shadow-sm transition"
              >
                <Printer size={14} /> Cetak Checklist
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3.5 mt-5">
              {checklist.map((item) => (
                <label
                  key={item}
                  className="flex items-center gap-2.5 bg-white p-3 rounded-xl border border-gray-100 text-xs font-medium text-gray-700 cursor-pointer hover:border-primary-200 transition shadow-2xs"
                >
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-300 text-brand-red focus:ring-brand-red/30 cursor-pointer"
                  />
                  <span>{item}</span>
                </label>
              ))}
            </div>
          </div> */}
        </main>

        <DashboardFooter />
      </div>
    </PageWithChatbot>
  );
}
