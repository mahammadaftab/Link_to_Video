const isValidUrl = (string) => {
  try {
    const url = new URL(string);
    return ['http:', 'https:'].includes(url.protocol);
  } catch (_) {
    return false;
  }
};

// Validate URL parameter
const validateUrl = (req, res, next) => {
  const { url } = req.body;
  
  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }
  
  if (!isValidUrl(url)) {
    return res.status(400).json({ error: 'Invalid URL format' });
  }
  
  // Additional platform validation
  const platformRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be|instagram\.com|facebook\.com|twitter\.com|x\.com|tiktok\.com|vimeo\.com)\//;
  
  if (!platformRegex.test(url)) {
    return res.status(400).json({ 
      error: 'Unsupported platform. Please use URLs from YouTube, Instagram, Facebook, Twitter/X, TikTok, or Vimeo.' 
    });
  }
  
  next();
};

// Validate conversion parameters
const validateConversionParams = (req, res, next) => {
  const { quality, format } = req.body;
  
  // Validate quality
  const validQualities = ['low', 'medium', 'high', 'ultra'];
  if (quality && !validQualities.includes(quality)) {
    return res.status(400).json({ error: `Invalid quality. Valid options: ${validQualities.join(', ')}` });
  }
  
  // Validate format
  const validFormats = ['mp4', 'mp3'];
  if (format && !validFormats.includes(format)) {
    return res.status(400).json({ error: `Invalid format. Valid options: ${validFormats.join(', ')}` });
  }
  
  next();
};

// Validate download parameters
const validateDownload = (req, res, next) => {
  const { id } = req.params;
  
  if (!id || typeof id !== 'string' || id.length < 5) {
    return res.status(400).json({ error: 'Invalid download ID' });
  }
  
  next();
};

module.exports = {
  validateUrl,
  validateConversionParams,
  validateDownload
};