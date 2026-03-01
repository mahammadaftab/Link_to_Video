const { exec } = require('child_process');
const util = require('util');
const fs = require('fs-extra');
const path = require('path');


const execPromise = util.promisify(exec);

// Regular expressions for platform detection
const PLATFORM_PATTERNS = {
  youtube: /^https?:\/\/(www\.)?youtube\.com\/watch\?v=|^https?:\/\/youtu\.be\//,
  instagram: /^https?:\/\/(www\.)?instagram\.com\/p\//,
  facebook: /^https?:\/\/(www\.)?facebook\.com\/.*\/videos?\//,
  twitter: /^https?:\/\/(www\.)?twitter\.com\/.*\/status\//,
  tiktok: /^https?:\/\/(www\.)?tiktok\.com\/.*\/video\//,
  vimeo: /^https?:\/\/(www\.)?vimeo\.com\//
};

// Detect platform from URL
const detectPlatform = (url) => {
  for (const [platform, pattern] of Object.entries(PLATFORM_PATTERNS)) {
    if (pattern.test(url)) {
      return platform;
    }
  }
  return 'unknown';
};

// Extract video information using yt-dlp
const extractVideoInfo = async (url) => {
  try {
    // First, check if yt-dlp is installed
    const { stdout: versionCheck } = await execPromise('yt-dlp --version');
    console.log('yt-dlp version:', versionCheck.trim());

    // Extract video info
    const command = `yt-dlp -j "${url}"`;
    const { stdout } = await execPromise(command);
    
    const videoData = JSON.parse(stdout);
    
    return {
      title: videoData.title || 'Unknown Title',
      thumbnail: videoData.thumbnail || '',
      duration: videoData.duration || 0,
      author: videoData.uploader || 'Unknown Author',
      formats: videoData.formats || [],
      availableQualities: extractAvailableQualities(videoData.formats || [])
    };
  } catch (error) {
    console.error('Error extracting video info:', error);
    throw new Error(`Failed to extract video information: ${error.message}`);
  }
};

// Extract available qualities from formats
const extractAvailableQualities = (formats) => {
  const qualities = new Set();
  
  formats.forEach(format => {
    if (format.height) {
      qualities.add(`${format.height}p`);
    } else if (format.quality) {
      qualities.add(format.quality);
    }
  });
  
  return Array.from(qualities).sort((a, b) => {
    // Sort by resolution (assuming p suffix for pixels)
    const numA = parseInt(a.replace(/\D/g, ''));
    const numB = parseInt(b.replace(/\D/g, ''));
    return numB - numA; // Descending order
  });
};

// Start video conversion using yt-dlp
const startVideoConversion = async ({ url, quality = 'medium', format = 'mp4', outputPath }) => {
  try {
    const qualityMap = {
      'low': 'worst',
      'medium': 'best[height<=720]',
      'high': 'best[height<=1080]',
      'ultra': 'best'
    };

    const qualityFilter = qualityMap[quality] || qualityMap['medium'];
    
    // Construct the yt-dlp command
    let command;
    if (format.toLowerCase() === 'mp3') {
      // Audio only extraction
      command = `yt-dlp -x --audio-format mp3 --audio-quality 0 -o "${outputPath}" "${url}"`;
    } else {
      // Video extraction with quality filter
      command = `yt-dlp -f "${qualityFilter}+bestaudio/best" --merge-output-format ${format} -o "${outputPath}" "${url}"`;
    }
    
    console.log('Executing command:', command);
    
    const { stdout, stderr } = await execPromise(command);
    console.log('Conversion completed:', stdout);
    
    return {
      success: true,
      outputPath,
      message: 'Video conversion completed successfully'
    };
  } catch (error) {
    console.error('Error during video conversion:', error);
    throw new Error(`Video conversion failed: ${error.message}`);
  }
};

module.exports = {
  extractVideoInfo,
  startVideoConversion,
  detectPlatform
};