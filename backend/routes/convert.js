const express = require('express');
const { convertVideo } = require('../controllers/videoController');
const { validateUrl, validateConversionParams } = require('../middleware/validation');

const router = express.Router();

router.post('/', validateUrl, validateConversionParams, convertVideo);

module.exports = router;