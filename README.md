# Universal Video Generator

A full-stack web application that allows users to paste video URLs from various platforms and convert them to downloadable formats with multiple quality options.

## 🚀 Features

- **Multi-Platform Support**: YouTube, Instagram, Facebook, Twitter/X, TikTok, Vimeo
- **Video Analysis**: Extract metadata (title, thumbnail, duration, author)
- **Multiple Formats**: MP4 and MP3 extraction
- **Quality Options**: From 144p to 4K resolution
- **Modern UI**: Glassmorphism + Neon gradient theme with Framer Motion animations
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Job Queue System**: Background processing with Bull.js and Redis
- **Security**: Rate limiting, input validation, and CORS protection

## 🛠️ Tech Stack

### Backend
- Node.js + Express
- yt-dlp for video extraction
- Bull.js for job queues
- Redis for caching
- Helmet.js for security
- Winston for logging

### Frontend
- Next.js 14+ with App Router
- React 18
- Tailwind CSS
- Framer Motion for animations
- react-hot-toast for notifications

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Redis server (optional, in-memory queue works too)
- yt-dlp installed on the system

## 🚀 Installation

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Install yt-dlp:
```bash
# On Windows
winget install yt-dlp/yt-dlp

# On macOS
brew install yt-dlp

# On Linux
sudo curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp
sudo chmod a+rx /usr/local/bin/yt-dlp
```

4. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

5. Start the server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file based on `.env.example`:
```bash
cp .env.local.example .env.local
```

4. Start the development server:
```bash
npm run dev
```

## 🏗️ Project Structure

```
Universal-Video-Generator/
├── backend/                 # Node.js/Express server
│   ├── routes/             # API routes
│   ├── controllers/        # Request handlers
│   ├── services/           # Business logic
│   ├── middleware/         # Validation and auth
│   ├── utils/             # Helper functions
│   ├── jobs/              # Background job processors
│   ├── uploads/           # Temporary file storage
│   ├── server.js          # Main server file
│   └── package.json       # Dependencies
├── frontend/               # Next.js application
│   ├── src/
│   │   ├── app/           # Page components
│   │   ├── components/    # Reusable UI components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── services/      # API clients
│   │   └── styles/        # Global styles
│   ├── public/            # Static assets
│   ├── next.config.js     # Next.js config
│   └── package.json       # Dependencies
└── README.md
```

## 🔧 API Endpoints

- `POST /api/analyze` - Analyze video URL and extract metadata
- `POST /api/convert` - Convert video to desired format
- `GET /api/download/:id` - Download converted video
- `GET /api/status/:id` - Get conversion status
- `GET /health` - Health check endpoint

## 🎨 UI Components

- Glassmorphism cards with neon borders
- Animated input fields with platform detection
- Custom video player with playback controls
- Quality and format selectors
- Download history with local storage
- Dark/light mode toggle
- Drag and drop support

## 🚨 Compliance Notice

This application is designed for educational purposes only. Users should respect copyright laws and platform terms of service when using this tool. The developers are not responsible for any misuse of this application.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## ⚠️ Disclaimer

This software is provided "as is" without warranty of any kind, express or implied. Use at your own risk and ensure compliance with applicable laws and platform terms of service.