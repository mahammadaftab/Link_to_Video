import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const DownloadHistory = () => {
  const [history, setHistory] = useState([]);

  // Load download history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('downloadHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Save to localStorage whenever history changes
  useEffect(() => {
    localStorage.setItem('downloadHistory', JSON.stringify(history));
  }, [history]);

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('downloadHistory');
  };

  if (history.length === 0) {
    return null;
  }

  return (
    <motion.div
      className="glass-effect-dark rounded-2xl p-8 border border-white/10 shadow-2xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-white">Download History</h2>
        {history.length > 0 && (
          <button
            onClick={clearHistory}
            className="text-red-400 hover:text-red-300 text-sm transition-colors duration-300"
          >
            Clear History
          </button>
        )}
      </div>
      
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {history.map((item, index) => (
          <motion.div
            key={index}
            className="flex items-center justify-between p-4 bg-black/20 rounded-lg border border-gray-700"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#00f2fe] to-[#a832ff] rounded-lg flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-white truncate max-w-xs">{item.title || 'Video Download'}</h3>
                <p className="text-sm text-gray-400">{new Date(item.timestamp).toLocaleString()}</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <span className={`px-2 py-1 rounded text-xs ${
                item.format === 'mp4' 
                  ? 'bg-blue-500/20 text-blue-300' 
                  : 'bg-purple-500/20 text-purple-300'
              }`}>
                {item.format.toUpperCase()}
              </span>
              <span className={`px-2 py-1 rounded text-xs ${
                item.quality === 'low' 
                  ? 'bg-green-500/20 text-green-300' 
                  : item.quality === 'medium'
                  ? 'bg-yellow-500/20 text-yellow-300'
                  : item.quality === 'high'
                  ? 'bg-orange-500/20 text-orange-300'
                  : 'bg-red-500/20 text-red-300'
              }`}>
                {item.quality}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default DownloadHistory;