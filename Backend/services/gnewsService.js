const API_KEY = process.env.GNEWS_API_KEY;

// ======================================================
// CACHE
// ======================================================

let newsCache = null;

// Cache berlaku selama 10 menit
const CACHE_DURATION = 10 * 60 * 1000;

// ======================================================
// CATEGORY
// ======================================================

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

  if (
    text.includes('longsor') ||
    text.includes('tanah longsor')
  ) {
    return {
      name: 'Longsor',
      color: 'bg-yellow-600'
    };
  }

  if (
    text.includes('cuaca') ||
    text.includes('hujan') ||
    text.includes('angin') ||
    text.includes('meteorologi')
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

// ======================================================
// CLEAN CONTENT
// ======================================================

function cleanContent(content) {
  if (!content) {
    return null;
  }

  return content
    // Menghilangkan [2750 chars], [123 chars], dll
    .replace(/\[\d+\s*chars\]/gi, '')

    // Menghilangkan spasi berlebihan
    .replace(/\s+/g, ' ')

    // Menghilangkan spasi di awal/akhir
    .trim();
}

// ======================================================
// FORMAT DATE
// ======================================================

function formatDate(dateString) {
  if (!dateString) {
    return 'Tanggal tidak tersedia';
  }

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return 'Tanggal tidak tersedia';
  }

  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
}

// ======================================================
// GET NEWS
// ======================================================

async function getDisasterNews() {

  // ====================================================
  // 1. CEK CACHE
  // ====================================================

  if (
    newsCache &&
    Date.now() - newsCache.timestamp < CACHE_DURATION
  ) {
    console.log('Menggunakan berita dari CACHE');

    return newsCache.data;
  }

  // ====================================================
  // 2. CEK API KEY
  // ====================================================

  if (!API_KEY) {
    throw new Error(
      'GNEWS_API_KEY belum diatur di file .env'
    );
  }

  // ====================================================
  // 3. REQUEST GNEWS
  // ====================================================

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

  let response;

  try {
    response = await fetch(url);
  } catch (error) {

    // Kalau request GNews gagal tetapi cache tersedia
    if (newsCache?.data?.length) {

      console.log(
        'GNews tidak dapat diakses. Menggunakan CACHE lama.'
      );

      return newsCache.data;
    }

    throw new Error(
      'Tidak dapat terhubung ke GNews'
    );
  }

  // ====================================================
  // 4. HANDLE ERROR GNEWS
  // ====================================================

  if (!response.ok) {

    const errorText =
      await response.text();

    console.error(
      `GNews Error ${response.status}:`,
      errorText
    );

    // ================================================
    // FALLBACK CACHE
    // ================================================

    if (newsCache?.data?.length) {

      console.log(
        'Menggunakan CACHE lama karena GNews sedang bermasalah.'
      );

      return newsCache.data;
    }

    throw new Error(
      `GNews Error ${response.status}: ${errorText}`
    );
  }

  // ====================================================
  // 5. PARSE JSON
  // ====================================================

  const data =
    await response.json();

  const articles =
    data.articles || [];

  // ====================================================
  // 6. SORT BERITA TERBARU
  // ====================================================

  articles.sort(
    (a, b) =>
      new Date(b.publishedAt) -
      new Date(a.publishedAt)
  );

  // ====================================================
  // 7. TRANSFORM DATA
  // ====================================================

  const formattedNews =
    articles.map((article, index) => {

      const category =
        determineCategory(
          article.title,
          article.description
        );

      const content =
        cleanContent(
          article.content
        );

      const description =
        article.description?.trim() ||
        'Tidak ada deskripsi berita yang tersedia.';

      // ==================================================
      // BODY DETAIL
      // ==================================================

      const body = [];

      // Paragraf pertama
      if (description) {
        body.push(description);
      }

      // Paragraf kedua dari content GNews
      if (
        content &&
        content !== description
      ) {
        body.push(content);
      }

      // Kalau tidak ada content
      if (body.length === 0) {
        body.push(
          'Informasi lengkap mengenai berita ini dapat dibaca melalui sumber berita asli.'
        );
      }

      return {

        // ==============================================
        // ID
        // ==============================================

        id:
          `gnews-${index}-${Date.parse(
            article.publishedAt
          )}`,

        // ==============================================
        // TITLE
        // ==============================================

        title:
          article.title ||
          'Judul berita tidak tersedia',

        // ==============================================
        // EXCERPT
        // ==============================================

        excerpt:
          description,

        // ==============================================
        // BODY
        // ==============================================

        body,

        // ==============================================
        // DATE
        // ==============================================

        date:
          formatDate(
            article.publishedAt
          ),

        publishedAt:
          article.publishedAt,

        // ==============================================
        // CATEGORY
        // ==============================================

        category:
          category.name,

        categoryColor:
          category.color,

        // ==============================================
        // SOURCE
        // ==============================================

        source:
          article.source?.name ||
          'Sumber tidak diketahui',

        // ==============================================
        // IMAGE
        // ==============================================

        image:
          article.image ||
          null,

        // ==============================================
        // ORIGINAL URL
        // ==============================================

        url:
          article.url || null

      };
    });

  // ====================================================
  // 8. SIMPAN CACHE
  // ====================================================

  newsCache = {
    data: formattedNews,
    timestamp: Date.now()
  };

  console.log(
    `Berhasil mengambil ${formattedNews.length} berita dari GNews.`
  );

  console.log(
    'Berita berhasil disimpan ke CACHE.'
  );

  return formattedNews;
}

// ======================================================
// EXPORT
// ======================================================

module.exports = {
  getDisasterNews,
  determineCategory
};