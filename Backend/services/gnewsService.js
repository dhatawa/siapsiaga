const API_KEY = process.env.GNEWS_API_KEY;

// Cache berita
let newsCache = null;

// Waktu cache: 10 menit
const CACHE_DURATION = 10 * 60 * 1000;

// ========================================
// CATEGORY
// ========================================

function determineCategory(title, description = '') {
  const text = `${title} ${description}`.toLowerCase();

  if (text.includes('tsunami')) {
    return {
      name: 'Tsunami',
      color: 'bg-red-600'
    };
  }

  if (text.includes('gempa')) {
    return {
      name: 'Gempa',
      color: 'bg-orange-500'
    };
  }

  if (text.includes('banjir')) {
    return {
      name: 'Banjir',
      color: 'bg-blue-600'
    };
  }

  if (text.includes('longsor')) {
    return {
      name: 'Longsor',
      color: 'bg-yellow-600'
    };
  }

  if (
    text.includes('cuaca') ||
    text.includes('hujan') ||
    text.includes('angin')
  ) {
    return {
      name: 'Cuaca',
      color: 'bg-cyan-600'
    };
  }

  return {
    name: 'Bencana',
    color: 'bg-gray-600'
  };
}

// ========================================
// GET NEWS
// ========================================

async function getDisasterNews() {

  // ======================================
  // CEK CACHE
  // ======================================

  if (
    newsCache &&
    Date.now() - newsCache.timestamp < CACHE_DURATION
  ) {
    console.log('Menggunakan berita dari CACHE');

    return newsCache.data;
  }

  // ======================================
  // CEK API KEY
  // ======================================

  if (!API_KEY) {
    throw new Error(
      'GNEWS_API_KEY belum diatur di file .env'
    );
  }

  // ======================================
  // REQUEST GNEWS
  // ======================================

  const params = new URLSearchParams({
    q: 'gempa OR tsunami OR banjir OR longsor OR bencana',
    lang: 'id',
    country: 'id',
    max: '10',
    apikey: API_KEY
  });

  const url =
    `https://gnews.io/api/v4/search?${params.toString()}`;

  console.log('Mengambil berita dari GNews...');

  const response = await fetch(url);

  // ======================================
  // ERROR
  // ======================================

  if (!response.ok) {

    const errorText =
      await response.text();

    throw new Error(
      `GNews Error ${response.status}: ${errorText}`
    );
  }

  const data =
    await response.json();

  const articles =
    data.articles || [];

  // ======================================
  // SORT TERBARU
  // ======================================

  articles.sort(
    (a, b) =>
      new Date(b.publishedAt) -
      new Date(a.publishedAt)
  );

  // ======================================
  // TRANSFORM
  // ======================================

  const formattedNews =
    articles.map(
      (article, index) => {

        const category =
          determineCategory(
            article.title,
            article.description
          );

        return {

          id:
            `gnews-${index}-${Date.parse(
              article.publishedAt
            )}`,

          title:
            article.title,

          excerpt:
            article.description ||
            'Tidak ada deskripsi berita.',

          body: [

            article.description ||
              'Tidak ada deskripsi berita.',

            article.content ||
              'Baca berita selengkapnya melalui sumber asli.'

          ],

          date:
            new Date(
              article.publishedAt
            ).toLocaleDateString(
              'id-ID',
              {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
              }
            ),

          publishedAt:
            article.publishedAt,

          category:
            category.name,

          categoryColor:
            category.color,

          source:
            article.source?.name ||
            'Sumber tidak diketahui',

          image:
            article.image ||
            null,

          url:
            article.url
        };
      }
    );

  // ======================================
  // SIMPAN CACHE
  // ======================================

  newsCache = {
    data: formattedNews,
    timestamp: Date.now()
  };

  console.log('Berita berhasil disimpan ke CACHE');

  return formattedNews;
}

module.exports = {
  getDisasterNews,
  determineCategory
};