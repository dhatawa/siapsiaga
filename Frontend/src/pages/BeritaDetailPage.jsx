import { useEffect, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Calendar, User, Share2, Link2, Radio, ExternalLink, Clock } from 'lucide-react';
import Swal from 'sweetalert2';

import DashboardNavbar from '../components/DashboardNavbar';
import DashboardFooter from '../components/DashboardFooter';
import NewsImage from '../components/NewsImage';
import { newsService, formatRelativeTime } from '../services/newsService';

// KONTAK DARURAT
const emergencyContacts = [
  { label: 'Polisi', number: '110' },
  { label: 'Pemadam Kebakaran', number: '113' },
  { label: 'Ambulans', number: '118' },
  { label: 'BNPB', number: '117' },
];

const toast = Swal.mixin({
  toast: true,
  position: 'bottom-start',
  showConfirmButton: false,
  timer: 2000,
  timerProgressBar: true,
});

export default function BeritaDetailPage() {
  const { id } = useParams();

  const [news, setNews] = useState(null);
  const [otherNews, setOtherNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchNewsDetail() {
      try {
        setLoading(true);
        setError(null);

        const [detail, list] = await Promise.all([
          newsService.getNewsDetail(id),
          newsService.getNews().catch(() => []),
        ]);

        if (cancelled) return;

        setNews(detail);

        // Berita terkait: kategori sama diutamakan, lalu berita terbaru lainnya
        const others = list.filter((n) => n.id !== id);
        const sameCategory = others.filter((n) => n.category === detail?.category);
        const different = others.filter((n) => n.category !== detail?.category);
        setOtherNews([...sameCategory, ...different].slice(0, 5));
      } catch (err) {
        console.error('DETAIL NEWS ERROR:', err);
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchNewsDetail();
    window.scrollTo({ top: 0 });

    return () => {
      cancelled = true;
    };
  }, [id]);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.fire({ icon: 'success', title: 'Link berita berhasil disalin.' });
    } catch (err) {
      console.error('Gagal menyalin link:', err);
      toast.fire({ icon: 'error', title: 'Gagal menyalin link.' });
    }
  }

  async function shareNews() {
    if (navigator.share) {
      try {
        await navigator.share({ title: news.title, text: news.excerpt, url: window.location.href });
      } catch {
        // Pengguna membatalkan dialog bagikan
      }
      return;
    }
    copyLink();
  }

  // BERITA TIDAK ADA
  if (!loading && !error && !news) {
    return <Navigate to="/berita" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <DashboardNavbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
        {/* BREADCRUMB */}
        <div className="text-xs text-gray-400 mb-4">
          <Link to="/berita" className="hover:underline">
            Berita
          </Link>
          <span className="mx-1.5">›</span>
          <span className="text-gray-600">Detail Berita</span>
        </div>

        {loading ? (
          <DetailSkeleton />
        ) : error ? (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 text-center">
            <p className="text-red-600 font-semibold">Gagal memuat berita</p>
            <p className="text-sm text-gray-500 mt-2">{error}</p>
            <Link
              to="/berita"
              className="inline-block mt-5 text-sm text-primary-700 font-medium hover:underline"
            >
              ← Kembali ke berita
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-[1fr_320px] gap-6">
            {/* MAIN ARTICLE */}
            <article className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <span
                className={`inline-block text-[10px] font-semibold text-white px-2 py-0.5 rounded ${news.categoryColor} mb-3`}
              >
                {news.category}
              </span>

              <h1 className="text-xl md:text-2xl font-bold text-gray-900 leading-snug">{news.title}</h1>

              {/* META */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 mt-3">
                <span className="flex items-center gap-1">
                  <Calendar size={12} />
                  {news.date}
                </span>

                {news.publishedAt && (
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {formatRelativeTime(news.publishedAt)}
                  </span>
                )}

                {news.source && (
                  <span className="flex items-center gap-1">
                    <User size={12} />
                    {news.source}
                  </span>
                )}
              </div>

              {/* IMAGE */}
              <div className="rounded-lg bg-gray-100 overflow-hidden mt-5 aspect-video">
                <NewsImage src={news.image} alt={news.title} label="Tidak ada gambar berita" />
              </div>

              <p className="text-[11px] text-gray-400 text-center mt-2">Sumber: {news.source}</p>

              {/* RINGKASAN */}
              <div className="mt-7">
                <h2 className="text-base font-semibold text-gray-800 mb-3">Ringkasan Berita</h2>

                <div className="space-y-5">
                  {news.body?.map((paragraph, index) => (
                    <p key={index} className="text-sm md:text-[15px] text-gray-600 leading-7">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              {/* CATATAN */}
              <div className="mt-7 bg-blue-50 border border-blue-100 rounded-lg p-4">
                <p className="text-xs text-gray-500 leading-relaxed">
                  Informasi pada halaman ini merupakan ringkasan berdasarkan data yang tersedia dari
                  sumber berita terkait. Untuk informasi dan konteks selengkapnya, silakan membaca
                  artikel asli melalui sumber yang tercantum di bawah.
                </p>
              </div>

              {/* ORIGINAL ARTICLE */}
              {news.url && (
                <div className="mt-6 bg-gray-50 rounded-lg p-5">
                  <p className="text-xs text-gray-500 mb-1">Artikel asli:</p>
                  <a
                    href={news.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-brand-red font-medium hover:underline"
                  >
                    Baca selengkapnya di sumber berita
                    <ExternalLink size={14} />
                  </a>
                </div>
              )}

              {/* SHARE */}
              <div className="flex items-center gap-3 mt-8 pt-4 border-t border-gray-100">
                <span className="text-xs text-gray-400">Bagikan artikel ini:</span>

                <button
                  type="button"
                  onClick={shareNews}
                  className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200"
                  title="Bagikan"
                >
                  <Share2 size={13} />
                </button>

                <button
                  type="button"
                  onClick={copyLink}
                  className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200"
                  title="Salin link"
                >
                  <Link2 size={13} />
                </button>
              </div>
            </article>

            {/* SIDEBAR */}
            <aside className="flex flex-col gap-5">
              {/* BERITA LAINNYA */}
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                <p className="text-sm font-semibold text-gray-800 flex items-center gap-1.5 mb-4">
                  <Radio size={14} className="text-primary-700" />
                  Berita Terkait
                </p>

                {otherNews.length === 0 ? (
                  <p className="text-xs text-gray-400 leading-relaxed">Belum ada berita lainnya.</p>
                ) : (
                  <div className="space-y-4">
                    {otherNews.map((n) => (
                      <Link key={n.id} to={`/berita/${n.id}`} className="group flex gap-3">
                        <div className="w-16 h-16 shrink-0 rounded-md bg-gray-100 overflow-hidden">
                          <NewsImage src={n.image} alt={n.title} label="" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-gray-800 leading-snug line-clamp-2 group-hover:text-primary-700 transition-colors">
                            {n.title}
                          </p>
                          <p className="text-[11px] text-gray-400 mt-1">
                            {n.category} • {formatRelativeTime(n.publishedAt) || n.date}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* EMERGENCY */}
              <div className="bg-blue-50 rounded-xl p-5">
                <p className="text-sm font-semibold text-primary-700 flex items-center gap-1.5 mb-1">
                  ✳ Kontak Darurat
                </p>
                <p className="text-[11px] text-gray-500 mb-3">
                  Simpan nomor penting ini untuk kondisi darurat bencana.
                </p>

                <div className="space-y-2">
                  {emergencyContacts.map((contact) => (
                    <a
                      key={contact.label}
                      href={`tel:${contact.number}`}
                      className="flex items-center justify-between bg-white rounded-md px-3 py-2 text-xs hover:bg-red-50 transition-colors"
                    >
                      <span className="text-gray-600">{contact.label}</span>
                      <span className="font-bold text-brand-red">{contact.number}</span>
                    </a>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        )}
      </main>

      <DashboardFooter />
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="grid lg:grid-cols-[1fr_320px] gap-6 animate-pulse">
      <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-3">
        <div className="h-4 w-16 bg-gray-200 rounded" />
        <div className="h-6 w-full bg-gray-200 rounded" />
        <div className="h-6 w-2/3 bg-gray-200 rounded" />
        <div className="h-3 w-48 bg-gray-100 rounded" />
        <div className="aspect-video bg-gray-200 rounded-lg mt-5" />
        <div className="h-3 w-full bg-gray-100 rounded mt-6" />
        <div className="h-3 w-full bg-gray-100 rounded" />
        <div className="h-3 w-4/5 bg-gray-100 rounded" />
      </div>
      <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4 h-fit">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="flex gap-3">
            <div className="w-16 h-16 bg-gray-200 rounded-md" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-full bg-gray-200 rounded" />
              <div className="h-3 w-2/3 bg-gray-100 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
