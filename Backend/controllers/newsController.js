const {
  getDisasterNews
} = require('../services/gnewsService');


async function getNews(req, res) {
  try {
    const news = await getDisasterNews();

    res.json({
      success: true,
      count: news.length,
      data: news
    });

  } catch (error) {
    console.error(
      'GET NEWS ERROR:',
      error.message
    );

    res.status(500).json({
      success: false,
      message: 'Gagal mengambil berita',
      error: error.message
    });
  }
}


async function getNewsDetail(req, res) {
  try {
    const { id } = req.params;

    const news = await getDisasterNews();

    const article = news.find(
      (item) => item.id === id
    );

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Berita tidak ditemukan'
      });
    }

    res.json({
      success: true,
      data: article
    });

  } catch (error) {
    console.error(
      'GET NEWS DETAIL ERROR:',
      error.message
    );

    res.status(500).json({
      success: false,
      message: 'Gagal mengambil detail berita'
    });
  }
}

module.exports = {
  getNews,
  getNewsDetail
};