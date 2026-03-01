const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs-extra');
const { extractVideoInfo, startVideoConversion } = require('../services/extractionService');
const QueueService = require('../services/queueService');

// Analyze video URL and extract metadata
const analyzeVideo = async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    // Extract video info
    const videoInfo = await extractVideoInfo(url);
    
    if (!videoInfo) {
      return res.status(400).json({ error: 'Could not extract video information. Please check the URL.' });
    }

    res.status(200).json({
      success: true,
      data: {
        id: uuidv4(),
        url,
        title: videoInfo.title,
        thumbnail: videoInfo.thumbnail,
        duration: videoInfo.duration,
        author: videoInfo.author,
        formats: videoInfo.formats || [],
        availableQualities: videoInfo.availableQualities || []
      }
    });
  } catch (error) {
    console.error('Error analyzing video:', error);
    res.status(500).json({ error: 'Failed to analyze video URL' });
  }
};

// Convert video to desired format
const convertVideo = async (req, res) => {
  try {
    const { url, quality = 'medium', format = 'mp4' } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    // Create a unique job ID
    const jobId = uuidv4();
    
    // Add job to queue
    const job = await QueueService.addConversionJob({
      jobId,
      url,
      quality,
      format,
      userId: req.user?.id || null
    });

    res.status(200).json({
      success: true,
      jobId: job.id,
      message: 'Video conversion started',
      statusUrl: `/api/status/${jobId}`
    });
  } catch (error) {
    console.error('Error starting video conversion:', error);
    res.status(500).json({ error: 'Failed to start video conversion' });
  }
};

// Handle video download
const downloadVideo = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ error: 'Download ID is required' });
    }

    // Check if file exists
    const filePath = path.join(__dirname, '../uploads/temp', `${id}.mp4`);
    
    if (!await fs.pathExists(filePath)) {
      return res.status(404).json({ error: 'File not found or expired' });
    }

    // Send file for download
    res.download(filePath, `video_${id}.mp4`, async (err) => {
      if (err) {
        console.error('Error sending file:', err);
        res.status(500).json({ error: 'Error downloading file' });
      }
      
      // Optionally delete file after download
      // setTimeout(() => {
      //   fs.remove(filePath).catch(console.error);
      // }, 10000); // Delete after 10 seconds
    });
  } catch (error) {
    console.error('Error handling download:', error);
    res.status(500).json({ error: 'Failed to handle download' });
  }
};

module.exports = {
  analyzeVideo,
  convertVideo,
  downloadVideo
};