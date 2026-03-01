// API service for video processing

const API_BASE_URL = process.env.BACKEND_API_URL || 'http://localhost:5000';

// Analyze video URL
export const analyzeVideo = async (url) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to analyze video');
    }
    
    return data;
  } catch (error) {
    console.error('Error analyzing video:', error);
    throw error;
  }
};

// Convert video
export const convertVideo = async (url, quality = 'medium', format = 'mp4') => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/convert`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url, quality, format }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to start conversion');
    }
    
    return data;
  } catch (error) {
    console.error('Error starting conversion:', error);
    throw error;
  }
};

// Get conversion status
export const getConversionStatus = async (jobId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/status/${jobId}`);
    
    if (!response.ok) {
      throw new Error('Failed to get conversion status');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error getting status:', error);
    throw error;
  }
};

// Download converted video
export const downloadVideo = async (jobId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/download/${jobId}`);
    
    if (!response.ok) {
      throw new Error('Failed to download video');
    }
    
    return response.blob();
  } catch (error) {
    console.error('Error downloading video:', error);
    throw error;
  }
};