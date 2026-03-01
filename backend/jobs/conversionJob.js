// Conversion job definition
// This file defines the structure and processing logic for video conversion jobs
// It's used by the queue service to process video conversion tasks

const path = require('path');
const { startVideoConversion } = require('../services/extractionService');
const { sanitizeFilename } = require('../utils/helpers');

class ConversionJob {
  constructor(data) {
    this.jobId = data.jobId;
    this.url = data.url;
    this.quality = data.quality || 'medium';
    this.format = data.format || 'mp4';
    this.userId = data.userId || null;
    this.createdAt = data.createdAt || new Date().toISOString();
    this.outputPath = path.join(__dirname, '../uploads/temp', `${this.jobId}.${this.format}`);
  }

  async process() {
    try {
      console.log(`Starting conversion job ${this.jobId} for URL: ${this.url}`);
      
      // Perform the video conversion
      const result = await startVideoConversion({
        url: this.url,
        quality: this.quality,
        format: this.format,
        outputPath: this.outputPath
      });
      
      console.log(`Conversion job ${this.jobId} completed successfully`);
      
      return {
        success: true,
        jobId: this.jobId,
        outputPath: result.outputPath,
        message: result.message
      };
    } catch (error) {
      console.error(`Error in conversion job ${this.jobId}:`, error);
      throw error;
    }
  }

  static async create(data) {
    const job = new ConversionJob(data);
    return job;
  }
}

module.exports = ConversionJob;