import { useState } from 'react';
import { motion } from 'framer-motion';

const VideoInput = ({ onAnalyze, isLoading }) => {
  const [url, setUrl] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (url.trim()) {
      onAnalyze(url.trim());
    }
  };

  return (
    <motion.div
      className="glass-effect-dark rounded-2xl p-8 border border-white/10 shadow-2xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-semibold text-white mb-6 text-center">Paste Video Link</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="video-url" className="block text-sm font-medium text-gray-300 mb-2">
            Video URL
          </label>
          <div className="relative">
            <input
              type="url"
              id="video-url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
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
          className={`w-full py-3 px-6 rounded-lg font-medium text-white transition-all duration-300 ${
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
  );
};

export default VideoInput;