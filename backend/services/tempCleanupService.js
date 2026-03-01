const fs = require('fs-extra');
const path = require('path');
const { cleanTempFiles } = require('../utils/helpers');

class TempCleanupService {
  constructor(intervalHours = 1) {
    this.intervalHours = intervalHours;
    this.cleanupInterval = null;
  }

  // Start the cleanup service
  start() {
    console.log(`🧹 Temp cleanup service started. Running every ${this.intervalHours} hour(s).`);
    
    // Run cleanup immediately when starting
    this.runCleanup();
    
    // Set up periodic cleanup
    this.cleanupInterval = setInterval(() => {
      this.runCleanup();
    }, this.intervalHours * 60 * 60 * 1000); // Convert hours to milliseconds
  }

  // Stop the cleanup service
  stop() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      console.log('🧹 Temp cleanup service stopped.');
    }
  }

  // Run cleanup operation
  async runCleanup() {
    try {
      console.log('🧹 Running temporary file cleanup...');
      await cleanTempFiles(this.intervalHours * 2); // Clean files older than 2x the interval
      
      // Get stats after cleanup
      const tempDir = path.join(__dirname, '../uploads/temp');
      if (await fs.pathExists(tempDir)) {
        const files = await fs.readdir(tempDir);
        console.log(`📊 Temp directory now contains ${files.length} files.`);
      }
    } catch (error) {
      console.error('❌ Error during temp cleanup:', error);
    }
  }
}

module.exports = TempCleanupService;