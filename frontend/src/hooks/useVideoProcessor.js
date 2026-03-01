import { useState, useEffect } from 'react';
import { analyzeVideo, convertVideo, getConversionStatus } from '@/services/api';

const useVideoProcessor = () => {
  const [videoData, setVideoData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [conversionProgress, setConversionProgress] = useState(0);
  const [error, setError] = useState(null);

  // Analyze video URL
  const analyze = async (url) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await analyzeVideo(url);
      setVideoData(data.data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Convert video
  const convert = async (url, quality, format) => {
    setIsConverting(true);
    setConversionProgress(0);
    setError(null);
    
    try {
      const data = await convertVideo(url, quality, format);
      
      // Poll for conversion status
      const pollStatus = async (jobId) => {
        try {
          const statusData = await getConversionStatus(jobId);
          
          if (statusData.status === 'completed') {
            setConversionProgress(100);
            setIsConverting(false);
            
            // Open download in new tab
            window.open(`${process.env.BACKEND_API_URL || 'http://localhost:5000'}/api/download/${jobId}`, '_blank');
            return statusData;
          } else if (statusData.status === 'failed') {
            setIsConverting(false);
            setError('Video conversion failed');
            return statusData;
          } else {
            // Update progress based on job state
            let progress = 0;
            switch(statusData.status) {
              case 'waiting':
                progress = 10;
                break;
              case 'active':
                progress = 50;
                break;
              case 'delayed':
                progress = 20;
                break;
              case 'paused':
                progress = 30;
                break;
              default:
                progress = 0;
            }
            setConversionProgress(progress);
            
            // Continue polling
            setTimeout(() => pollStatus(jobId), 2000);
          }
        } catch (error) {
          console.error('Error checking status:', error);
          setIsConverting(false);
          setError('Error checking conversion status');
        }
      };
      
      // Start polling
      await pollStatus(data.jobId);
      return data;
    } catch (err) {
      setError(err.message);
      setIsConverting(false);
      throw err;
    }
  };

  // Reset state
  const reset = () => {
    setVideoData(null);
    setIsLoading(false);
    setIsConverting(false);
    setConversionProgress(0);
    setError(null);
  };

  return {
    videoData,
    isLoading,
    isConverting,
    conversionProgress,
    error,
    analyze,
    convert,
    reset
  };
};

export default useVideoProcessor;