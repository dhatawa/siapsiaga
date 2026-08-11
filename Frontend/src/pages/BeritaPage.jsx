import {
  useState,
  useMemo,
  useEffect
} from 'react';

import { Link } from 'react-router-dom';

import { Calendar } from 'lucide-react';

import DashboardNavbar from '../components/DashboardNavbar';
import DashboardFooter from '../components/DashboardFooter';

const PAGE_SIZE = 5;

const newsCategories = [
  'Semua Berita',
  'Gempa',
  'Tsunami',
  'Banjir',
  'Longsor',
  'Cuaca',
  'Bencana'
];

const API_URL = 'http://localhost:5000/api';

export default function BeritaPage() {

  const [newsList, setNewsList] =
    useState([]);

  const [activeCategory, setActiveCategory] =
    useState('Semua Berita');

  const [page, setPage] =
    useState(1);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(null);

  // ========================================
  // FETCH NEWS
  // ========================================

  useEffect(() => {

    async function fetchNews() {

      try {

        setLoading(true);
        setError(null);

        const response = await fetch(
          `${API_URL}/news`
        );

        if (!response.ok) {
          throw new Error(
            'Gagal mengambil berita'
          );
        }

        const result =
          await response.json();

        setNewsList(
          result.data || []
        );

      } catch (error) {

        console.error(error);

        setError(
          error.message
        );

      } finally {

        setLoading(false);

      }
    }

    fetchNews();

  }, []);

  // ========================================
  // FEATURED
  // ========================================

  const featured =
    newsList[0];

  const rest =
    newsList.slice(1);

  // ========================================
  // FILTER
  // ========================================

  const filtered = useMemo(() => {

    if (
      activeCategory ===
      'Semua Berita'
    ) {
      return rest;
    }

    return rest.filter(
      (n) =>
        n.category ===
        activeCategory
    );

  }, [
    activeCategory,
    rest
  ]);

  // ========================================
  // PAGINATION
  // ========================================

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        filtered.length /
        PAGE_SIZE
      )
    );

  const paginated =
    filtered.slice(
      (page - 1) *
        PAGE_SIZE,

      page *
        PAGE_SIZE
    );

  // ========================================
  // LOADING
  // ========================================

  if (loading) {

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">

        <div className="text-center">

          <div className="animate-spin w-8 h-8 border-4 border-gray-200 border-t-primary-700 rounded-full mx-auto" />

          <p className="text-sm text-gray-500 mt-3">
            Memuat berita terbaru...
          </p>

        </div>

      </div>
    );
  }

  // ========================================
  // ERROR
  // ========================================

  if (error) {

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">

        <div className="text-center">

          <p className="text-red-500 font-medium">
            Gagal memuat berita
          </p>

          <p className="text-sm text-gray-500 mt-1">
            {error}
          </p>

        </div>

      </div>
    );
  }

  // ========================================
  // EMPTY
  // ========================================

  if (!featured) {

    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">

        <DashboardNavbar />

        <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">

          <h1 className="text-2xl font-bold text-gray-900">
            Berita Terkini
          </h1>

          <p className="text-sm text-gray-500 mt-2">
            Belum ada berita tersedia.
          </p>

        </main>

        <DashboardFooter />

      </div>
    );
  }

  return (

    <div className="min-h-screen bg-gray-50 flex flex-col">

      <DashboardNavbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">

        <h1 className="text-2xl font-bold text-gray-900">
          Berita Terkini
        </h1>

        <p className="text-sm text-gray-500 mt-1 max-w-2xl">
          Pantau informasi terbaru mengenai
          kondisi cuaca, peringatan dini,
          dan mitigasi bencana di seluruh
          wilayah Indonesia.
        </p>

        {/* FEATURED */}

        <Link
          to={`/berita/${featured.id}`}
          className="grid md:grid-cols-[1.6fr_1fr] gap-0 mt-6 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
        >

          <div className="h-56 md:h-auto bg-gray-100 overflow-hidden">

            {featured.image ? (

              <img
                src={featured.image}
                alt={featured.title}
                className="w-full h-full object-cover"
              />

            ) : (

              <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">
                Tidak ada gambar
              </div>

            )}

          </div>

          <div className="p-6 flex flex-col">

            <div className="flex items-center gap-2 text-[11px] text-gray-400 mb-2">

              <Calendar size={12} />

              {featured.date}

            </div>

            <span
              className={`inline-block w-fit text-[10px] font-semibold text-white px-2 py-0.5 rounded ${featured.categoryColor} mb-2`}
            >
              {featured.category}
            </span>

            <h2 className="font-bold text-gray-900 leading-snug">

              {featured.title}

            </h2>

            <p className="text-xs text-gray-500 mt-2 leading-relaxed line-clamp-4">

              {featured.excerpt}

            </p>

            <span className="text-xs text-primary-700 font-medium mt-3">

              Baca →

            </span>

          </div>

        </Link>

        {/* CATEGORY */}

        <div className="flex items-center gap-6 mt-8 border-b border-gray-200 overflow-x-auto">

          {newsCategories.map(
            (cat) => (

              <button
                key={cat}

                onClick={() => {

                  setActiveCategory(cat);

                  setPage(1);

                }}

                className={`text-sm pb-3 -mb-px border-b-2 whitespace-nowrap transition-colors ${
                  activeCategory === cat
                    ? 'border-brand-red text-brand-red font-medium'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >

                {cat}

              </button>

            )
          )}

        </div>

        {/* NEWS GRID */}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">

          {paginated.map(
            (n) => (

              <Link
                key={n.id}
                to={`/berita/${n.id}`}
                className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow flex flex-col"
              >

                <div className="h-32 bg-gray-100 overflow-hidden">

                  {n.image ? (

                    <img
                      src={n.image}
                      alt={n.title}
                      className="w-full h-full object-cover"
                    />

                  ) : (

                    <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">
                      {n.category}
                    </div>

                  )}

                </div>

                <div className="p-4 flex flex-col flex-1">

                  <div className="flex items-center justify-between mb-1.5">

                    <span
                      className={`text-[10px] font-semibold text-white px-2 py-0.5 rounded ${n.categoryColor}`}
                    >
                      {n.category}
                    </span>

                    <span className="text-[11px] text-gray-400">
                      {n.date}
                    </span>

                  </div>

                  <p className="text-sm font-semibold text-gray-900 leading-snug">

                    {n.title}

                  </p>

                  <p className="text-xs text-gray-500 mt-1.5 leading-relaxed line-clamp-2 flex-1">

                    {n.excerpt}

                  </p>

                  <span className="text-xs text-primary-700 font-medium mt-2">

                    Baca →

                  </span>

                </div>

              </Link>

            )
          )}

        </div>

        {/* PAGINATION */}

        {totalPages > 1 && (

          <div className="flex items-center justify-center gap-2 mt-8">

            <button
              onClick={() =>
                setPage(
                  (p) =>
                    Math.max(
                      1,
                      p - 1
                    )
                )
              }
              disabled={page === 1}
              className="w-8 h-8 rounded-md border border-gray-200 text-gray-400 flex items-center justify-center disabled:opacity-40"
            >
              ‹
            </button>

            {Array.from(
              {
                length:
                  totalPages
              },
              (_, i) =>
                i + 1
            ).map((p) => (

              <button
                key={p}
                onClick={() =>
                  setPage(p)
                }
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
              onClick={() =>
                setPage(
                  (p) =>
                    Math.min(
                      totalPages,
                      p + 1
                    )
                )
              }
              disabled={
                page === totalPages
              }
              className="w-8 h-8 rounded-md border border-gray-200 text-gray-400 flex items-center justify-center disabled:opacity-40"
            >
              ›

            </button>

          </div>

        )}

      </main>

      <DashboardFooter />

    </div>
  );
}