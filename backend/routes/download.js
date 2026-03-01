const express = require('express');
const { downloadVideo } = require('../controllers/videoController');
const { validateDownload } = require('../middleware/validation');

const router = express.Router();

router.get('/:id', validateDownload, downloadVideo);

module.exports = router;