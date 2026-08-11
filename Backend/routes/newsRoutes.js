const express = require('express');

const {
  getNews,
  getNewsDetail
} = require('../controllers/newsController');

const router = express.Router();

// GET /api/news
router.get('/', getNews);

// GET /api/news/:id
router.get('/:id', getNewsDetail);

module.exports = router;