import {
  useEffect,
  useState
} from 'react';

import {
  useParams,
  Link,
  Navigate
} from 'react-router-dom';

import {
  Calendar,
  User,
  AlertTriangle,
  Share2,
  Link2,
  Radio
} from 'lucide-react';

import DashboardNavbar from '../components/DashboardNavbar';
import DashboardFooter from '../components/DashboardFooter';

const API_URL =
  'http://localhost:5000/api';

const emergencyContacts = [
  {
    label: 'Polisi',
    number: '110'
  },
  {
    label: 'Pemadam Kebakaran',
    number: '113'
  },
  {
    label: 'Ambulans',
    number: '118'
  },
  {
    label: 'BNPB',
    number: '117'
  }
];

export default function BeritaDetailPage() {

  const { id } = useParams();

  const [news, setNews] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(null);

  useEffect(() => {

    async function fetchDetail() {

      try {

        setLoading(true);

        const response =
          await fetch(
            `${API_URL}/news/${id}`
          );

        if (
          response.status === 404
        ) {
          setNews(null);
          return;
        }

        if (!response.ok) {
          throw new Error(
            'Gagal mengambil berita'
          );
        }

        const result =
          await response.json();

        setNews(result.data);

      } catch (error) {

        console.error(error);

        setError(
          error.message
        );

      } finally {

        setLoading(false);

      }
    }

    fetchDetail();

  }, [id]);

  if (loading) {

    return (
      <div className="min-h-screen flex items-center justify-center">

        <p className="text-gray-500">
          Memuat berita...
        </p>

      </div>
    );
  }

  if (error) {

    return (
      <div className="min-h-screen flex items-center justify-center">

        <p className="text-red-500">
          {error}
        </p>

      </div>
    );
  }

  if (!news) {

    return (
      <Navigate
        to="/berita"
        replace
      />
    );
  }

  return (

    <div className="min-h-screen bg-gray-50 flex flex-col">

      <DashboardNavbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">

        <div className="text-xs text-gray-400 mb-4">

          <Link
            to="/berita"
            className="hover:underline"
          >
            Berita
          </Link>

          <span className="mx-1.5">
            ›
          </span>

          <span className="text-gray-600">
            Detail Berita
          </span>

        </div>

        <div className="grid lg:grid-cols-[1fr_320px] gap-6">

          {/* ARTICLE */}

          <article className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">

            <span
              className={`inline-block text-[10px] font-semibold text-white px-2 py-0.5 rounded ${news.categoryColor} mb-3`}
            >
              {news.category}
            </span>

            <h1 className="text-xl md:text-2xl font-bold text-gray-900 leading-snug">

              {news.title}

            </h1>

            <div className="flex items-center gap-4 text-xs text-gray-400 mt-3">

              <span className="flex items-center gap-1">

                <Calendar size={12} />

                {news.date}

              </span>

              {news.source && (

                <span className="flex items-center gap-1">

                  <User size={12} />

                  {news.source}

                </span>

              )}

            </div>

            {/* IMAGE */}

            <div className="rounded-lg bg-gray-100 overflow-hidden mt-4">

              {news.image ? (

                <img
                  src={news.image}
                  alt={news.title}
                  className="w-full h-full object-cover"
                />

              ) : (

                <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">
                  Tidak ada gambar
                </div>

              )}

            </div>

            <p className="text-[11px] text-gray-400 text-center mt-2">

              Sumber:
              {' '}
              {news.source}

            </p>

            {/* BODY */}

            <div className="mt-6 space-y-4 text-sm text-gray-600 leading-relaxed">

              {news.body?.map(
                (paragraph, index) => (

                  <p key={index}>
                    {paragraph}
                  </p>

                )
              )}

            </div>

            {/* SOURCE */}

            {news.url && (

              <div className="mt-6 p-4 bg-gray-50 rounded-lg">

                <p className="text-xs text-gray-500">

                  Artikel asli:

                </p>

                <a
                  href={news.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary-700 font-medium hover:underline"
                >
                  Baca di sumber berita →
                </a>

              </div>

            )}

            {/* SHARE */}

            <div className="flex items-center gap-3 mt-8 pt-4 border-t border-gray-100">

              <span className="text-xs text-gray-400">
                Bagikan artikel ini:
              </span>

              <button className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200">

                <Share2 size={13} />

              </button>

              <button
                onClick={() =>
                  navigator.clipboard.writeText(
                    window.location.href
                  )
                }
                className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200"
              >

                <Link2 size={13} />

              </button>

            </div>

          </article>

          {/* SIDEBAR */}

          <aside className="flex flex-col gap-5">

            {/* POPULAR */}

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">

              <p className="text-sm font-semibold text-gray-800 flex items-center gap-1.5 mb-4">

                <Radio
                  size={14}
                  className="text-primary-700"
                />

                Berita Terpopuler

              </p>

              <p className="text-xs text-gray-400">
                Fitur berita populer akan
                tersedia setelah sistem
                statistik berita dibuat.
              </p>

            </div>

            {/* EMERGENCY */}

            <div className="bg-blue-50 rounded-xl p-5">

              <p className="text-sm font-semibold text-primary-700 flex items-center gap-1.5 mb-1">

                ✳ Kontak Darurat

              </p>

              <p className="text-[11px] text-gray-500 mb-3">

                Simpan nomor penting ini
                untuk kondisi darurat
                bencana.

              </p>

              <div className="space-y-2">

                {emergencyContacts.map(
                  (contact) => (

                    <div
                      key={contact.label}
                      className="flex items-center justify-between bg-white rounded-md px-3 py-2 text-xs"
                    >

                      <span className="text-gray-600">

                        {contact.label}

                      </span>

                      <span className="font-bold text-brand-red">

                        {contact.number}

                      </span>

                    </div>

                  )
                )}

              </div>

            </div>

          </aside>

        </div>

      </main>

      <DashboardFooter />

    </div>
  );
}