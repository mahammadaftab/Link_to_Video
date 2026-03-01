const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Checking for yt-dlp installation...');

try {
  // Try to run yt-dlp --version to check if it's installed
  const version = execSync('yt-dlp --version', { encoding: 'utf-8' });
  console.log('✅ yt-dlp is already installed. Version:', version.trim());
} catch (error) {
  console.log('❌ yt-dlp is not installed.');
  
  // Detect OS and provide installation instructions
  const platform = process.platform;
  
  console.log('\n💡 Please install yt-dlp manually:');
  console.log('   For more information, visit: https://github.com/yt-dlp/yt-dlp#installation');
  
  if (platform === 'win32') {
    console.log('\n   On Windows, you can install with:');
    console.log('   winget install yt-dlp/yt-dlp');
    console.log('   Or download from: https://github.com/yt-dlp/yt-dlp/releases/latest');
  } else if (platform === 'darwin') {
    console.log('\n   On macOS, you can install with:');
    console.log('   brew install yt-dlp');
  } else if (platform === 'linux') {
    console.log('\n   On Linux, you can install with:');
    console.log('   sudo curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp');
    console.log('   sudo chmod a+rx /usr/local/bin/yt-dlp');
  }
  
  console.log('\n   After installation, make sure yt-dlp is in your PATH.');
  console.log('   You can verify the installation by running: yt-dlp --version');
}