const path = require('path');
const fs = require('fs-extra');

// Format duration in seconds to HH:MM:SS
const formatDuration = (seconds) => {
  if (!seconds) return '00:00';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  const formattedHours = hours > 0 ? String(hours).padStart(2, '0') + ':' : '';
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(secs).padStart(2, '0');
  
  return `${formattedHours}${formattedMinutes}:${formattedSeconds}`;
};

// Clean temporary files older than specified hours
const cleanTempFiles = async (hours = 24) => {
  try {
    const tempDir = path.join(__dirname, '../uploads/temp');
    const cutoffTime = Date.now() - (hours * 60 * 60 * 1000);
    
    const files = await fs.readdir(tempDir);
    
    for (const file of files) {
      const filePath = path.join(tempDir, file);
      const stat = await fs.stat(filePath);
      
      if (stat.mtime < cutoffTime) {
        await fs.remove(filePath);
        console.log(`Removed old temp file: ${filePath}`);
      }
    }
  } catch (error) {
    console.error('Error cleaning temp files:', error);
  }
};

// Validate file size (in bytes)
const isValidFileSize = (size, maxSizeMB = 1000) => {
  return size <= (maxSizeMB * 1024 * 1024);
};

// Sanitize filename
const sanitizeFilename = (filename) => {
  return filename.replace(/[^a-zA-Z0-9.-]/g, '_');
};

module.exports = {
  formatDuration,
  cleanTempFiles,
  isValidFileSize,
  sanitizeFilename
};