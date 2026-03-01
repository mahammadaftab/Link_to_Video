const express = require('express');
const { analyzeVideo } = require('../controllers/videoController');
const { validateUrl } = require('../middleware/validation');

const router = express.Router();

router.post('/', validateUrl, analyzeVideo);

module.exports = router;