import { motion } from 'framer-motion';

const QualitySelector = ({ selectedQuality, setSelectedQuality, selectedFormat, setSelectedFormat }) => {
  const qualities = [
    { value: 'low', label: 'Low (480p)', desc: 'Smaller file size, faster download' },
    { value: 'medium', label: 'Medium (720p)', desc: 'Good balance of quality and size' },
    { value: 'high', label: 'High (1080p)', desc: 'HD quality for most screens' },
    { value: 'ultra', label: 'Ultra (4K)', desc: 'Highest quality available' },
  ];

  const formats = [
    { value: 'mp4', label: 'MP4 Video' },
    { value: 'mp3', label: 'MP3 Audio' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-white mb-3">Quality Settings</h3>
        <div className="grid grid-cols-2 gap-3">
          {qualities.map((quality) => (
            <motion.label
              key={quality.value}
              className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-300 ${
                selectedQuality === quality.value
                  ? 'bg-[#00f2fe]/20 border border-[#00f2fe] text-white'
                  : 'bg-black/20 border border-gray-700 text-gray-300 hover:bg-black/30'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <input
                type="radio"
                name="quality"
                value={quality.value}
                checked={selectedQuality === quality.value}
                onChange={() => setSelectedQuality(quality.value)}
                className="sr-only"
              />
              <div className="flex items-center">
                <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                  selectedQuality === quality.value
                    ? 'border-[#00f2fe] bg-[#00f2fe]'
                    : 'border-gray-500'
                }`}>
                  {selectedQuality === quality.value && (
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  )}
                </div>
                <div>
                  <div className="font-medium">{quality.label}</div>
                  <div className="text-xs opacity-70">{quality.desc}</div>
                </div>
              </div>
            </motion.label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-white mb-3">Output Format</h3>
        <div className="grid grid-cols-2 gap-3">
          {formats.map((format) => (
            <motion.label
              key={format.value}
              className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-300 ${
                selectedFormat === format.value
                  ? 'bg-[#00f2fe]/20 border border-[#00f2fe] text-white'
                  : 'bg-black/20 border border-gray-700 text-gray-300 hover:bg-black/30'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <input
                type="radio"
                name="format"
                value={format.value}
                checked={selectedFormat === format.value}
                onChange={() => setSelectedFormat(format.value)}
                className="sr-only"
              />
              <div className="flex items-center">
                <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                  selectedFormat === format.value
                    ? 'border-[#00f2fe] bg-[#00f2fe]'
                    : 'border-gray-500'
                }`}>
                  {selectedFormat === format.value && (
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  )}
                </div>
                <div className="font-medium">{format.label}</div>
              </div>
            </motion.label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QualitySelector;