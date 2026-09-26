const express = require('express');

const {
  getNews,
  getNewsDetail
} = require('../controllers/newsController');

const router = express.Router();

router.get('/', getNews);

router.get('/:id', getNewsDetail);

module.exports = router;