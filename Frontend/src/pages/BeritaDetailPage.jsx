import { useParams, Link, Navigate } from 'react-router-dom';
import { Calendar, User, AlertTriangle, Share2, Link2, Radio } from 'lucide-react';
import DashboardNavbar from '../components/DashboardNavbar';
import DashboardFooter from '../components/DashboardFooter';
import { newsList, popularNews, emergencyContacts } from '../data/beritaData';

export default function BeritaDetailPage() {
  const { id } = useParams();
  const news = newsList.find((n) => n.id === id);

  if (!news) return <Navigate to="/berita" replace />;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <DashboardNavbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
        <div className="text-xs text-gray-400 mb-4">
          <Link to="/berita" className="hover:underline">Berita</Link>
          <span className="mx-1.5">›</span>
          <span className="text-gray-600">Detail Berita</span>
        </div>

        <div className="grid lg:grid-cols-[1fr_320px] gap-6">
          {/* Main article */}
          <article className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <span className={`inline-block text-[10px] font-semibold text-white px-2 py-0.5 rounded ${news.categoryColor} mb-3`}>
              {news.category}
            </span>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 leading-snug">{news.title}</h1>

            <div className="flex items-center gap-4 text-xs text-gray-400 mt-3">
              <span className="flex items-center gap-1">
                <Calendar size={12} /> {news.date}
              </span>
              {news.source && (
                <span className="flex items-center gap-1">
                  <User size={12} /> {news.source}
                </span>
              )}
            </div>

            <div className="h-56 rounded-lg bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center text-gray-300 text-sm mt-4">
              Peta Intensitas Gempa
            </div>
            <p className="text-[11px] text-gray-400 text-center mt-2">
              Peta intensitas gempa (dikeluarkan BMKG) menunjukkan wilayah terdampak.
            </p>

            <div className="mt-6 space-y-4 text-sm text-gray-600 leading-relaxed">
              {news.body.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            {news.impactAreas && (
              <div className="mt-6">
                <p className="text-sm font-semibold text-gray-800 mb-2">Dampak di Wilayah Terdampak</p>
                <p className="text-sm text-gray-600 mb-3">
                  Guncangan gempa bumi ini dirasakan di beberapa wilayah dengan rincian antara lain:
                </p>
                <ul className="space-y-2">
                  {news.impactAreas.map((a) => (
                    <li key={a.area} className="text-sm text-gray-600">
                      <span className="font-semibold text-gray-800">{a.area}:</span> {a.desc}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {news.warning && (
              <div className="bg-brand-red text-white rounded-lg p-4 mt-6 flex gap-3">
                <AlertTriangle size={18} className="shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold mb-1">Status Tsunami</p>
                  <p className="text-xs leading-relaxed text-white/90">{news.warning}</p>
                </div>
              </div>
            )}

            {news.footerNote && (
              <p className="text-sm text-gray-600 leading-relaxed mt-6">{news.footerNote}</p>
            )}

            <div className="flex items-center gap-3 mt-8 pt-4 border-t border-gray-100">
              <span className="text-xs text-gray-400">Bagikan artikel ini:</span>
              <button className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200">
                <Share2 size={13} />
              </button>
              <button className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200">
                <Link2 size={13} />
              </button>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="flex flex-col gap-5">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <p className="text-sm font-semibold text-gray-800 flex items-center gap-1.5 mb-4">
                <Radio size={14} className="text-primary-700" /> Berita Terpopuler
              </p>
              <div className="space-y-4">
                {popularNews.map((p) => (
                  <Link key={p.id} to={`/berita/${p.id}`} className="flex gap-3 group">
                    <div className="w-14 h-14 rounded-md bg-gray-100 shrink-0" />
                    <div>
                      <p className="text-[11px] text-primary-700">{p.category}</p>
                      <p className="text-xs font-medium text-gray-800 leading-snug group-hover:underline">
                        {p.title}
                      </p>
                      <p className="text-[10px] text-gray-400 mt-1">{p.date}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="bg-blue-50 rounded-xl p-5">
              <p className="text-sm font-semibold text-primary-700 flex items-center gap-1.5 mb-1">
                ✳ Kontak Darurat
              </p>
              <p className="text-[11px] text-gray-500 mb-3">
                Simpan nomor penting ini untuk kondisi darurat bencana.
              </p>
              <div className="space-y-2">
                {emergencyContacts.map((c) => (
                  <div
                    key={c.label}
                    className="flex items-center justify-between bg-white rounded-md px-3 py-2 text-xs"
                  >
                    <span className="text-gray-600">{c.label}</span>
                    <span className="font-bold text-brand-red">{c.number}</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>

      <DashboardFooter />
    </div>
  );
}
