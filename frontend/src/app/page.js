'use client';

import { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';

// Dynamically import components to reduce initial bundle size
const VideoInput = dynamic(() => import('@/components/VideoInput'));
const VideoPlayer = dynamic(() => import('@/components/VideoPlayer'));
const QualitySelector = dynamic(() => import('@/components/QualitySelector'));
const DownloadHistory = dynamic(() => import('@/components/DownloadHistory'));
const ThemeToggle = dynamic(() => import('@/components/ThemeToggle'));

export default function Home() {
  const [videoData, setVideoData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [conversionProgress, setConversionProgress] = useState(0);
  const [selectedQuality, setSelectedQuality] = useState('medium');
  const [selectedFormat, setSelectedFormat] = useState('mp4');
  const [currentTheme, setCurrentTheme] = useState('dark');
  const [dragActive, setDragActive] = useState(false);
  
  const fileInputRef = useRef(null);

  // Handle drag and drop events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  // Handle dropped files
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  // Handle file input change
  const handleFiles = (files) => {
    const file = files[0];
    if (file && file.type === 'text/plain') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        // Try to extract URL from text
        const urlMatch = text.match(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g);
        if (urlMatch && urlMatch[0]) {
          document.getElementById('video-url').value = urlMatch[0];
          analyzeVideo(urlMatch[0]);
        } else {
          toast.error('No valid URL found in the file');
        }
      };
      reader.readAsText(file);
    }
  };

  // Analyze video URL
  const analyzeVideo = async (url) => {
    if (!url) {
      toast.error('Please enter a video URL');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.BACKEND_API_URL || 'http://localhost:5000'}/api/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (data.success) {
        setVideoData(data.data);
        toast.success('Video analyzed successfully!');
      } else {
        toast.error(data.error || 'Failed to analyze video');
      }
    } catch (error) {
      console.error('Error analyzing video:', error);
      toast.error('Error analyzing video. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Convert video
  const convertVideo = async () => {
    if (!videoData) {
      toast.error('Please analyze a video first');
      return;
    }

    setIsConverting(true);
    setConversionProgress(0);

    try {
      const response = await fetch(`${process.env.BACKEND_API_URL || 'http://localhost:5000'}/api/convert`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: videoData.url,
          quality: selectedQuality,
          format: selectedFormat,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Conversion started!');

        // Poll for conversion status
        const pollStatus = async (jobId) => {
          try {
            const statusResponse = await fetch(`${process.env.BACKEND_API_URL || 'http://localhost:5000'}/api/status/${jobId}`);
            const statusData = await statusResponse.json();

            if (statusData.status === 'completed') {
              setConversionProgress(100);
              setIsConverting(false);
              
              // Trigger download
              window.open(`${process.env.BACKEND_API_URL || 'http://localhost:5000'}/api/download/${jobId}`, '_blank');
              
              toast.success('Video conversion completed!');
            } else if (statusData.status === 'failed') {
              setIsConverting(false);
              toast.error('Video conversion failed');
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
            toast.error('Error checking conversion status');
          }
        };

        // Start polling
        pollStatus(data.jobId);
      } else {
        setIsConverting(false);
        toast.error(data.error || 'Failed to start conversion');
      }
    } catch (error) {
      console.error('Error converting video:', error);
      setIsConverting(false);
      toast.error('Error starting conversion. Please try again.');
    }
  };

  // Handle URL submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const url = formData.get('video-url');
    analyzeVideo(url);
  };

  // Theme toggle effect
  useEffect(() => {
    if (currentTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [currentTheme]);

  return (
    <div 
      className={`min-h-screen transition-colors duration-300 ${currentTheme === 'dark' ? 'dark bg-gray-900' : 'bg-white'}`}
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
    >
      <Head>
        <title>Universal Video Generator</title>
        <meta name="description" content="Convert videos from any platform to downloadable formats" />
      </Head>

      <Toaster position="top-right" />

      {/* Floating background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full opacity-10"
            style={{
              background: 'radial-gradient(circle, rgba(0,242,254,0.4) 0%, rgba(168,50,255,0.1) 70%)',
              width: `${Math.random() * 300 + 100}px`,
              height: `${Math.random() * 300 + 100}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              x: [0, 10, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="relative z-10 py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <motion.h1 
            className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#00f2fe] to-[#a832ff]"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Universal Video Generator
          </motion.h1>
          
          <ThemeToggle currentTheme={currentTheme} setCurrentTheme={setCurrentTheme} />
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          className="glass-effect-dark rounded-2xl p-8 mb-12 border border-white/10 shadow-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-2xl font-semibold text-white mb-6 text-center">Paste Video Link</h2>
          
          {/* Drag and drop zone */}
          <div 
            className={`relative border-2 border-dashed rounded-xl p-8 text-center mb-6 transition-all duration-300 ${
              dragActive 
                ? 'border-[#00f2fe] bg-[#00f2fe]/10' 
                : 'border-gray-600 hover:border-[#00f2fe]'
            }`}
            onDragOver={(e) => e.preventDefault()}
          >
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept=".txt,.url"
              onChange={(e) => handleFiles(e.target.files)}
            />
            
            <div className="space-y-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-[#00f2fe] to-[#a832ff] flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              
              <p className="text-gray-300">
                Drop your URL text file here or <button 
                  className="text-[#00f2fe] underline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  browse
                </button>
              </p>
              <p className="text-sm text-gray-500">Supports YouTube, Instagram, Facebook, Twitter/X, TikTok, Vimeo</p>
            </div>
          </div>
          
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="video-url" className="block text-sm font-medium text-gray-300 mb-2">
                Video URL
              </label>
              <div className="relative">
                <input
                  type="url"
                  id="video-url"
                  name="video-url"
                  placeholder="Paste video URL here..."
                  className="w-full px-4 py-3 bg-black/20 border border-gray-700 rounded-lg focus:ring-2 focus:ring-[#00f2fe] focus:border-transparent text-white placeholder-gray-500 transition-all duration-300"
                  required
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </div>
              </div>
            </div>
            
            <motion.button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-6 rounded-lg font-medium text-white transition-all duration-300 flex items-center justify-center ${
                isLoading
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-gradient-to-r from-[#00f2fe] to-[#a832ff] hover:from-[#00c2cc] hover:to-[#8a22cc] shadow-lg shadow-[#00f2fe]/20 hover:shadow-[#00f2fe]/30'
              }`}
              whileHover={!isLoading ? { scale: 1.02 } : {}}
              whileTap={!isLoading ? { scale: 0.98 } : {}}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing...
                </>
              ) : (
                'Analyze Video'
              )}
            </motion.button>
          </form>
        </motion.div>

        {/* Video Preview Section */}
        {videoData && (
          <motion.div
            className="glass-effect-dark rounded-2xl p-8 mb-12 border border-white/10 shadow-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h2 className="text-2xl font-semibold text-white mb-6">Video Preview</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <div className="aspect-video bg-black/20 rounded-xl overflow-hidden mb-4">
                  {videoData.thumbnail ? (
                    <img 
                      src={videoData.thumbnail} 
                      alt={videoData.title} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-800">
                      <span className="text-gray-500">Thumbnail not available</span>
                    </div>
                  )}
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-white">{videoData.title}</h3>
                  <p className="text-gray-400">Author: {videoData.author}</p>
                  <p className="text-gray-400">Duration: {videoData.duration ? `${Math.floor(videoData.duration / 60)}:${String(Math.floor(videoData.duration % 60)).padStart(2, '0')}` : 'N/A'}</p>
                  
                  <div className="flex flex-wrap gap-2 mt-4">
                    {videoData.availableQualities?.slice(0, 5).map((quality, index) => (
                      <span key={index} className="px-3 py-1 bg-[#00f2fe]/20 text-[#00f2fe] rounded-full text-sm">
                        {quality}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <QualitySelector 
                  selectedQuality={selectedQuality}
                  setSelectedQuality={setSelectedQuality}
                  selectedFormat={selectedFormat}
                  setSelectedFormat={setSelectedFormat}
                />
                
                <motion.button
                  onClick={convertVideo}
                  disabled={isConverting}
                  className={`w-full py-3 px-6 rounded-lg font-medium text-white transition-all duration-300 ${
                    isConverting
                      ? 'bg-gray-600 cursor-not-allowed'
                      : 'bg-gradient-to-r from-[#00f2fe] to-[#a832ff] hover:from-[#00c2cc] hover:to-[#8a22cc] shadow-lg shadow-[#00f2fe]/20 hover:shadow-[#00f2fe]/30'
                  }`}
                  whileHover={!isConverting ? { scale: 1.02 } : {}}
                  whileTap={!isConverting ? { scale: 0.98 } : {}}
                >
                  {isConverting ? (
                    <>
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Converting... {conversionProgress}%
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-1.5 mt-2">
                        <div 
                          className="bg-gradient-to-r from-[#00f2fe] to-[#a832ff] h-1.5 rounded-full transition-all duration-300" 
                          style={{ width: `${conversionProgress}%` }}
                        ></div>
                      </div>
                    </>
                  ) : (
                    'Convert & Download'
                  )}
                </motion.button>
                
                {/* Video Player Placeholder */}
                <div className="mt-6">
                  <h4 className="text-lg font-medium text-white mb-3">Preview</h4>
                  <div className="aspect-video bg-black/20 rounded-xl flex items-center justify-center">
                    <div className="text-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-500 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-gray-500">Converted video will appear here</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Download History */}
        <DownloadHistory />
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-6 px-4 sm:px-6 lg:px-8 mt-auto">
        <div className="text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} Universal Video Generator. This tool is for educational purposes only.</p>
          <p className="mt-1 text-xs">Please respect copyright laws and platform terms of service.</p>
        </div>
      </footer>
    </div>
  );
}