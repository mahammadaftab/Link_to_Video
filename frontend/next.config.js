/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['i.ytimg.com', 'img.youtube.com', 'scontent.cdninstagram.com', 'scontent.xx.fbcdn.net', 'pbs.twimg.com', 'vumbnail.com'],
  },
  env: {
    BACKEND_API_URL: process.env.BACKEND_API_URL || 'http://localhost:5000',
  },
};

module.exports = nextConfig;