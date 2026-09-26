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
  Share2,
  Link2,
  Radio,
  ExternalLink
} from 'lucide-react';

import DashboardNavbar from '../components/DashboardNavbar';
import DashboardFooter from '../components/DashboardFooter';


// API
const API_URL =
  'http://localhost:5000/api';


// KONTAK DARURAT

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


// COMPONENT

export default function BeritaDetailPage() {

  const { id } = useParams();


  // STATE

  const [news, setNews] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(null);


  // FETCH DETAIL

  useEffect(() => {

    async function fetchNewsDetail() {

      try {

        setLoading(true);
        setError(null);

        const response =
          await fetch(
            `${API_URL}/news/${id}`
          );


        // BERITA TIDAK DITEMUKAN

        if (response.status === 404) {

          setNews(null);

          return;
        }


        // ERROR SERVER

        if (!response.ok) {

          const errorData =
            await response
              .json()
              .catch(() => null);

          throw new Error(
            errorData?.error ||
            errorData?.message ||
            `HTTP Error ${response.status}`
          );
        }


        // JSON

        const result =
          await response.json();


        // SIMPAN DATA

        setNews(
          result.data
        );

      } catch (error) {

        console.error(
          'DETAIL NEWS ERROR:',
          error
        );

        setError(
          error.message
        );

      } finally {

        setLoading(false);

      }

    }


    fetchNewsDetail();

  }, [id]);


  // LOADING

  if (loading) {

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">

        <div className="text-center">

          <div className="w-8 h-8 border-4 border-gray-200 border-t-primary-700 rounded-full animate-spin mx-auto" />

          <p className="text-sm text-gray-500 mt-3">
            Memuat detail berita...
          </p>

        </div>

      </div>
    );
  }


  // ERROR

  if (error) {

    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">

        <DashboardNavbar />

        <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-12">

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 text-center">

            <p className="text-red-600 font-semibold">
              Gagal memuat berita
            </p>

            <p className="text-sm text-gray-500 mt-2">
              {error}
            </p>

            <Link
              to="/berita"
              className="inline-block mt-5 text-sm text-primary-700 font-medium hover:underline"
            >
              ← Kembali ke berita
            </Link>

          </div>

        </main>

        <DashboardFooter />

      </div>
    );
  }


  // BERITA TIDAK ADA

  if (!news) {

    return (
      <Navigate
        to="/berita"
        replace
      />
    );
  }


  // SHARE

  async function copyLink() {

    try {

      await navigator.clipboard.writeText(
        window.location.href
      );

      alert(
        'Link berita berhasil disalin.'
      );

    } catch (error) {

      console.error(
        'Gagal menyalin link:',
        error
      );

    }
  }


  // RENDER

  return (

    <div className="min-h-screen bg-gray-50 flex flex-col">

      <DashboardNavbar />


      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">


        {/* BREADCRUMB */}

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


        {/* LAYOUT */}

        <div className="grid lg:grid-cols-[1fr_320px] gap-6">


          {/* MAIN ARTICLE */}

          <article className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">


            {/* CATEGORY */}

            <span
              className={`inline-block text-[10px] font-semibold text-white px-2 py-0.5 rounded ${news.categoryColor} mb-3`}
            >
              {news.category}
            </span>


            {/* TITLE */}

            <h1 className="text-xl md:text-2xl font-bold text-gray-900 leading-snug">

              {news.title}

            </h1>


            {/* META */}

            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 mt-3">

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

            <div className="rounded-lg bg-gray-100 overflow-hidden mt-5">

              {news.image ? (

                <img
                  src={news.image}
                  alt={news.title}
                  className="w-full h-full object-cover"
                />

              ) : (

                <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">

                  Tidak ada gambar berita

                </div>

              )}

            </div>


            {/* IMAGE SOURCE */}

            <p className="text-[11px] text-gray-400 text-center mt-2">

              Sumber:
              {' '}
              {news.source}

            </p>


            {/* RINGKASAN */}

            <div className="mt-7">

              <h2 className="text-base font-semibold text-gray-800 mb-3">

                Ringkasan Berita

              </h2>


              <div className="space-y-5">

                {news.body?.map(
                  (paragraph, index) => (

                    <p
                      key={index}
                      className="text-sm md:text-[15px] text-gray-600 leading-7"
                    >
                      {paragraph}
                    </p>

                  )
                )}

              </div>

            </div>


            {/* CATATAN */}

            <div className="mt-7 bg-blue-50 border border-blue-100 rounded-lg p-4">

              <p className="text-xs text-gray-500 leading-relaxed">

                Informasi pada halaman ini
                merupakan ringkasan berdasarkan
                data yang tersedia dari sumber
                berita terkait. Untuk informasi
                dan konteks selengkapnya, silakan
                membaca artikel asli melalui sumber
                yang tercantum di bawah.

              </p>

            </div>


            {/* ORIGINAL ARTICLE */}

            {news.url && (

              <div className="mt-6 bg-gray-50 rounded-lg p-5">

                <p className="text-xs text-gray-500 mb-1">

                  Artikel asli:

                </p>


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

              <span className="text-xs text-gray-400">

                Bagikan artikel ini:

              </span>


              <button
                type="button"
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


            {/* POPULAR NEWS */}

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">

              <p className="text-sm font-semibold text-gray-800 flex items-center gap-1.5 mb-4">

                <Radio
                  size={14}
                  className="text-primary-700"
                />

                Berita Terpopuler

              </p>


              <p className="text-xs text-gray-400 leading-relaxed">

                Berita populer akan tersedia
                setelah sistem statistik dan
                jumlah pembaca berita diterapkan.

              </p>

            </div>


            {/*EMERGENCY*/}

            <div className="bg-blue-50 rounded-xl p-5">

              <p className="text-sm font-semibold text-primary-700 flex items-center gap-1.5 mb-1">

                ✳ Kontak Darurat

              </p>


              <p className="text-[11px] text-gray-500 mb-3">

                Simpan nomor penting ini untuk
                kondisi darurat bencana.

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