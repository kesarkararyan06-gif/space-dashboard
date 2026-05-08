# 🚀 Space Dashboard

A production-ready React + Vite dashboard featuring a real-time ISS tracker, space news aggregation, and an AI chatbot restricted to dashboard data.

![Space Dashboard](https://img.shields.io/badge/React-18-blue) ![Vite](https://img.shields.io/badge/Vite-5-purple) ![TailwindCSS](https://img.shields.io/badge/Tailwind-4-cyan)

## Features

### 🛰️ ISS Live Tracker
- Real-time ISS position updated every 15 seconds
- Interactive Leaflet.js map with trajectory path
- Speed calculation using the Haversine formula
- Reverse geocoding for nearest location
- Astronaut list (people currently in space)
- Speed history line chart

### 📰 News Dashboard
- Space news from multiple sources
- Search, sort, and filter functionality
- 15-minute localStorage caching
- Responsive card grid layout

### 🤖 AI Chatbot
- Powered by Mistral-7B via HuggingFace Inference API
- **Restricted to dashboard data only** — no external knowledge
- Floating chat widget with typing indicator
- Last 30 messages persisted in localStorage

### 📊 Charts & Visualization
- ISS Speed over time (Area chart)
- News distribution by source (Doughnut chart)
- Interactive Leaflet map

### 🎨 UI/UX
- Dark/Light mode with localStorage persistence
- Glassmorphism card design
- Skeleton loaders and loading states
- Toast notifications
- Fully responsive (mobile/tablet/desktop)

## Tech Stack

| Technology | Purpose |
|-----------|---------|
| React 18 | UI framework |
| Vite 5 | Build tool |
| Tailwind CSS 4 | Styling |
| Axios | HTTP requests |
| Leaflet.js + react-leaflet | Maps |
| Recharts | Charts |
| react-hot-toast | Notifications |
| Lucide React | Icons |

## Getting Started

### Prerequisites
- Node.js 18+
- npm 9+

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd space-dashboard

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
```

### Environment Variables

Edit `.env` and add your API keys:

```env
VITE_NEWS_API_KEY=         # Optional: GNews API key (https://gnews.io)
VITE_AI_TOKEN=             # Required for chatbot: HuggingFace token (https://huggingface.co/settings/tokens)
```

> **Note:** The news module works without an API key — it falls back to the free Spaceflight News API. The chatbot requires a HuggingFace token.

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build

```bash
npm run build
npm run preview
```

## Deployment (Vercel)

1. Push your code to GitHub
2. Import the repository on [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard:
   - `VITE_NEWS_API_KEY`
   - `VITE_AI_TOKEN`
4. Deploy! Vercel auto-detects Vite configuration.

### Vercel Configuration

No special configuration needed — Vite is auto-detected. If needed, these settings apply:

| Setting | Value |
|---------|-------|
| Framework | Vite |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | `npm install` |

## Project Structure

```
src/
├── components/
│   ├── iss/           # ISS tracker components
│   ├── news/          # News dashboard components
│   ├── chatbot/       # AI chatbot widget
│   ├── charts/        # Recharts visualizations
│   └── ui/            # Reusable UI components
├── services/          # API service modules
├── hooks/             # Custom React hooks
├── context/           # React context providers
├── utils/             # Utility functions
├── pages/             # Page-level components
├── App.jsx            # Main application
└── main.jsx           # Entry point
```

## API Credits

- [Open Notify](http://open-notify.org/) — ISS position & astronaut data
- [Spaceflight News API](https://www.spaceflightnewsapi.net/) — Space news
- [OpenStreetMap Nominatim](https://nominatim.openstreetmap.org/) — Reverse geocoding
- [HuggingFace](https://huggingface.co/) — AI inference

## License

MIT
