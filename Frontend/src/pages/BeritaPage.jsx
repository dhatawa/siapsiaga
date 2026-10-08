import { useState, useMemo, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, RefreshCw, Newspaper, AlertCircle } from 'lucide-react';

import DashboardNavbar from '../components/DashboardNavbar';
import DashboardFooter from '../components/DashboardFooter';
import PageWithChatbot from '../components/PageWithChatbot';
import NewsImage from '../components/NewsImage';
import { newsService, formatRelativeTime } from '../services/newsService';

const PAGE_SIZE = 6;

const ALL_CATEGORY = 'Semua Berita';

// Kategori mengikuti hasil determineCategory() di backend (gnewsService)
const newsCategories = [ALL_CATEGORY, 'Gempa', 'Tsunami', 'Banjir', 'Longsor', 'Cuaca', 'Bencana'];

export default function BeritaPage() {
  const [newsList, setNewsList] = useState([]);
  const [activeCategory, setActiveCategory] = useState(ALL_CATEGORY);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNews = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setNewsList(await newsService.getNews());
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  // Jumlah berita per kategori untuk label tab
  const categoryCounts = useMemo(() => {
    const counts = { [ALL_CATEGORY]: newsList.length };
    newsList.forEach((n) => {
      counts[n.category] = (counts[n.category] || 0) + 1;
    });
    return counts;
  }, [newsList]);

  // Berita utama = berita paling baru pada kategori aktif
  const filtered = useMemo(
    () =>
      activeCategory === ALL_CATEGORY
        ? newsList
        : newsList.filter((n) => n.category === activeCategory),
    [activeCategory, newsList]
  );

  const featured = filtered[0];
  const rest = filtered.slice(1);

  const totalPages = Math.max(1, Math.ceil(rest.length / PAGE_SIZE));
  const paginated = rest.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const changeCategory = (cat) => {
    setActiveCategory(cat);
    setPage(1);
  };

  const changePage = (p) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <PageWithChatbot>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <DashboardNavbar />

        <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Berita Terkini</h1>
              <p className="text-sm text-gray-500 mt-1 max-w-2xl">
                Pantau informasi terbaru mengenai kondisi cuaca, peringatan dini, dan mitigasi
                bencana di seluruh wilayah Indonesia.
              </p>
            </div>

            <button
              onClick={fetchNews}
              disabled={loading}
              className="shrink-0 flex items-center gap-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-md px-3 py-2 hover:bg-gray-50 disabled:opacity-50"
              title="Muat ulang berita"
            >
              <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
              <span className="hidden sm:inline">Muat Ulang</span>
            </button>
          </div>

          {loading ? (
            <NewsSkeleton />
          ) : error ? (
            <div className="mt-6 bg-white rounded-xl border border-gray-100 shadow-sm p-8 text-center">
              <AlertCircle size={28} className="mx-auto text-brand-red" />
              <p className="text-red-600 font-semibold mt-2">Gagal memuat berita</p>
              <p className="text-sm text-gray-500 mt-1">{error}</p>
              <button
                onClick={fetchNews}
                className="mt-4 text-sm text-white bg-primary-700 hover:bg-primary-800 rounded-md px-4 py-2"
              >
                Coba Lagi
              </button>
            </div>
          ) : (
            <>
              {/* CATEGORY */}
              <div className="flex items-center gap-6 mt-6 border-b border-gray-200 overflow-x-auto">
                {newsCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => changeCategory(cat)}
                    className={`text-sm pb-3 -mb-px border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                      activeCategory === cat
                        ? 'border-brand-red text-brand-red font-medium'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {cat}
                    <span
                      className={`text-[10px] px-1.5 rounded-full ${
                        activeCategory === cat ? 'bg-red-50 text-brand-red' : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      {categoryCounts[cat] || 0}
                    </span>
                  </button>
                ))}
              </div>

              {!featured ? (
                <div className="mt-6 bg-white rounded-xl border border-gray-100 shadow-sm p-10 text-center">
                  <Newspaper size={28} className="mx-auto text-gray-300" />
                  <p className="text-sm text-gray-500 mt-2">
                    {newsList.length === 0
                      ? 'Belum ada berita tersedia.'
                      : `Belum ada berita untuk kategori ${activeCategory}.`}
                  </p>
                </div>
              ) : (
                <>
                  {/* FEATURED (hanya di halaman pertama) */}
                  {page === 1 && (
                    <Link
                      to={`/berita/${featured.id}`}
                      className="group grid md:grid-cols-[1.6fr_1fr] gap-0 mt-6 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                    >
                      <div className="h-56 md:h-72 bg-gray-100 overflow-hidden">
                        <NewsImage
                          src={featured.image}
                          alt={featured.title}
                          className="group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>

                      <div className="p-6 flex flex-col">
                        <div className="flex items-center gap-2 text-[11px] text-gray-400 mb-2">
                          <Calendar size={12} />
                          {featured.date}
                          <span>•</span>
                          {formatRelativeTime(featured.publishedAt)}
                        </div>

                        <span
                          className={`inline-block w-fit text-[10px] font-semibold text-white px-2 py-0.5 rounded ${featured.categoryColor} mb-2`}
                        >
                          {featured.category}
                        </span>

                        <h2 className="font-bold text-gray-900 leading-snug group-hover:text-primary-700 transition-colors">
                          {featured.title}
                        </h2>

                        <p className="text-xs text-gray-500 mt-2 leading-relaxed line-clamp-4">
                          {featured.excerpt}
                        </p>

                        <div className="mt-auto pt-3 flex items-center justify-between">
                          <span className="text-[11px] text-gray-400 truncate">{featured.source}</span>
                          <span className="text-xs text-primary-700 font-medium">Baca →</span>
                        </div>
                      </div>
                    </Link>
                  )}

                  {/* NEWS GRID */}
                  {paginated.length > 0 && (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
                      {paginated.map((n) => (
                        <Link
                          key={n.id}
                          to={`/berita/${n.id}`}
                          className="group bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow flex flex-col"
                        >
                          <div className="h-32 bg-gray-100 overflow-hidden">
                            <NewsImage
                              src={n.image}
                              alt={n.title}
                              label={n.category}
                              className="group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>

                          <div className="p-4 flex flex-col flex-1">
                            <div className="flex items-center justify-between mb-1.5">
                              <span
                                className={`text-[10px] font-semibold text-white px-2 py-0.5 rounded ${n.categoryColor}`}
                              >
                                {n.category}
                              </span>
                              <span className="text-[11px] text-gray-400">
                                {formatRelativeTime(n.publishedAt) || n.date}
                              </span>
                            </div>

                            <p className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2 group-hover:text-primary-700 transition-colors">
                              {n.title}
                            </p>

                            <p className="text-xs text-gray-500 mt-1.5 leading-relaxed line-clamp-2 flex-1">
                              {n.excerpt}
                            </p>

                            <div className="mt-2 flex items-center justify-between gap-2">
                              <span className="text-[11px] text-gray-400 truncate">{n.source}</span>
                              <span className="text-xs text-primary-700 font-medium shrink-0">Baca →</span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}

                  {/* PAGINATION */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-8">
                      <button
                        onClick={() => changePage(Math.max(1, page - 1))}
                        disabled={page === 1}
                        className="w-8 h-8 rounded-md border border-gray-200 text-gray-400 flex items-center justify-center disabled:opacity-40"
                      >
                        ‹
                      </button>

                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                        <button
                          key={p}
                          onClick={() => changePage(p)}
                          className={`w-8 h-8 rounded-md text-sm flex items-center justify-center ${
                            p === page
                              ? 'bg-primary-700 text-white'
                              : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          {p}
                        </button>
                      ))}

                      <button
                        onClick={() => changePage(Math.min(totalPages, page + 1))}
                        disabled={page === totalPages}
                        className="w-8 h-8 rounded-md border border-gray-200 text-gray-400 flex items-center justify-center disabled:opacity-40"
                      >
                        ›
                      </button>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </main>

        <DashboardFooter />
      </div>
    </PageWithChatbot>
  );
}

function NewsSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="flex gap-6 mt-6 border-b border-gray-200 pb-3">
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} className="h-4 w-16 bg-gray-200 rounded" />
        ))}
      </div>

      <div className="grid md:grid-cols-[1.6fr_1fr] mt-6 bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="h-56 md:h-72 bg-gray-200" />
        <div className="p-6 space-y-3">
          <div className="h-3 w-32 bg-gray-200 rounded" />
          <div className="h-4 w-16 bg-gray-200 rounded" />
          <div className="h-5 w-full bg-gray-200 rounded" />
          <div className="h-5 w-3/4 bg-gray-200 rounded" />
          <div className="h-3 w-full bg-gray-100 rounded" />
          <div className="h-3 w-5/6 bg-gray-100 rounded" />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="h-32 bg-gray-200" />
            <div className="p-4 space-y-2">
              <div className="h-3 w-20 bg-gray-200 rounded" />
              <div className="h-4 w-full bg-gray-200 rounded" />
              <div className="h-3 w-5/6 bg-gray-100 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
