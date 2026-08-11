const express = require('express');

const {
  getLatestEarthquake
} = require('../services/bmkgService');

const router = express.Router();

router.get('/earthquake', async (req, res) => {
  try {
    const earthquake =
      await getLatestEarthquake();

    res.json({
      success: true,
      data: earthquake
    });

  } catch (error) {
    console.error(
      'BMKG ERROR:',
      error.message
    );

    res.status(500).json({
      success: false,
      message:
        'Gagal mengambil data gempa BMKG',
      error: error.message
    });
  }
});

module.exports = router;