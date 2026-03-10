# GitHub Profile Analyzer

A web application that analyzes any GitHub user's profile and generates visual insights with AI-powered summaries.

![GitHub Profile Analyzer Demo](https://img.shields.io/badge/Status-Live-brightgreen) ![Python](https://img.shields.io/badge/Python-3.9+-blue) ![React](https://img.shields.io/badge/React-18-61dafb)

## Features

- **Language Breakdown** - Interactive donut chart showing programming language distribution
- **Commit Activity** - Bar chart visualizing contribution patterns over time
- **Top Repositories** - Showcase of best projects with stars, forks, and descriptions
- **AI Developer Summary** - Intelligent profile analysis powered by Google Gemini, Ollama, or rule-based fallback
- **Dark Mode UI** - GitHub-inspired dark theme

## Tech Stack

**Frontend:**
- React 18 + Vite
- Material-UI (MUI)
- Recharts for data visualization

**Backend:**
- FastAPI (Python)
- httpx for async HTTP requests
- Ollama integration for local AI

## Quick Start

### Prerequisites
- Python 3.9+
- Node.js 18+
- [Ollama](https://ollama.com/) (optional, for AI summaries)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/github-profile-analyzer.git
   cd github-profile-analyzer
   ```

2. **Set up the backend**
   ```bash
   cd backend
   pip install -r requirements.txt
   cp .env.example .env
   # Edit .env and add your GitHub token (optional but recommended)
   ```

3. **Set up the frontend**
   ```bash
   cd frontend
   npm install
   ```

4. **Set up Ollama (optional, for AI summaries)**
   ```bash
   brew install ollama       # macOS
   ollama pull llama3.2      # Download the model
   ollama serve              # Start the server
   ```

### Running the App

**Terminal 1 - Backend:**
```bash
cd backend
uvicorn main:app --reload
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

**Terminal 3 - Ollama (optional):**
```bash
ollama serve
```

Open http://localhost:5173 and enter any GitHub username!

## Environment Variables

Create a `.env` file in the `backend` directory:

```env
# Optional: Increases GitHub API rate limit from 60 to 5000 requests/hour
GITHUB_TOKEN=your_github_personal_access_token

# Optional: Customize Ollama settings
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2
```

## Project Structure

```
├── backend/
│   ├── main.py           # FastAPI application
│   ├── github_api.py     # GitHub API integration
│   ├── ai_summary.py     # AI summary generation (Ollama + fallback)
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── components/
│   │   │   ├── SearchBar.jsx
│   │   │   ├── ProfileCard.jsx
│   │   │   ├── LanguageChart.jsx
│   │   │   ├── CommitHeatmap.jsx
│   │   │   ├── TopRepos.jsx
│   │   │   └── AISummary.jsx
│   │   └── api/
│   │       └── github.js
│   └── package.json
└── README.md
```

## API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /` | Health check |
| `GET /api/analyze/{username}` | Analyze a GitHub profile |

## How It Works

1. User enters a GitHub username
2. Backend fetches data from GitHub's REST API (user info, repos, languages, commit activity)
3. Data is processed and aggregated
4. AI generates a personalized developer summary (or falls back to rule-based analysis)
5. Frontend displays interactive visualizations

## Deployment

### Deploy Backend to Render (Free)

1. Go to [render.com](https://render.com) and sign up
2. Click **New > Web Service**
3. Connect your GitHub repo
4. Configure:
   - **Root Directory:** `backend`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Add environment variables:
   - `GEMINI_API_KEY` - Get free at [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
   - `GITHUB_TOKEN` - Optional but recommended
   - `FRONTEND_URL` - Your Vercel URL (after deploying frontend)

### Deploy Frontend to Vercel (Free)

1. Go to [vercel.com](https://vercel.com) and sign up
2. Click **Add New > Project**
3. Import your GitHub repo
4. Configure:
   - **Root Directory:** `frontend`
   - **Framework Preset:** Vite
5. Add environment variable:
   - `VITE_API_URL` - Your Render backend URL + `/api` (e.g., `https://your-app.onrender.com/api`)

### Update CORS

After deploying, add your Vercel URL to Render's `FRONTEND_URL` environment variable.

## License

MIT License - feel free to use this project for your portfolio!

---

Built with React, FastAPI, and Google Gemini AI
