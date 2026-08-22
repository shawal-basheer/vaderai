# VäderAI 🌤️

An AI-powered global weather intelligence agent built with React and FastAPI.

## Live Demo

🔗 [vader-ai.vercel.app](https://vader-ai.vercel.app)

## Features

- Real-time global weather for any city
- 7 day forecast with weather icons
- Historical climate data with Matplotlib charts
- Natural language AI chat powered by Groq
- Extreme weather alerts
- City comparison
- Travel weather advisor
- Climate change insights
- Text to speech responses
- Auto location detection
- Dark and light mode

## Tech Stack

- **Frontend** - React, Vite, Tailwind CSS, Recharts
- **Backend** - Python, FastAPI
- **AI** - LangChain, Groq API
- **Data** - Open-Meteo API (live, historical, climate)
- **Visualization** - Matplotlib
- **Hosting** - Vercel + Render

## Groq Model Configuration

Groq retires models periodically. Rather than hardcoding a model name in the source, the backend reads it from the `GROQ_MODEL` environment variable. If the variable is not set, the backend defaults to `openai/gpt-oss-20b`.

The currently available models can be listed by querying `https://api.groq.com/openai/v1/models` with your API key.

When a model is deprecated or becomes inaccessible, update the `GROQ_MODEL` value in your environment, for example in the Render dashboard, rather than changing code.

## Environment Variables

| Name | Required | Default | Purpose |
|------|----------|---------|---------|
| `GROQ_API_KEY` | Yes | none | API key for Groq, required for the AI chat features. Never commit this value. |
| `GROQ_MODEL` | No | `openai/gpt-oss-20b` | Which Groq model to use for the ChatGroq LLM. Update this when Groq retires a model. |

Copy `backend/.env.example` to `backend/.env` and fill in your values before running locally.

## API Endpoints

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/` | Welcome message and service status |
| GET | `/health` | Health check and active model configuration |
| POST | `/chat` | Send a natural language question to the AI agent |
| GET | `/weather/{city}` | Current weather for a city |
| GET | `/forecast/{city}` | 7 day forecast for a city |
| GET | `/location?lat={lat}&lon={lon}` | Reverse geocode coordinates to a city name |
| GET | `/climate/{city}?start_year={year}` | Historical climate data with generated explanation |

Example response from `/health`:

```json
{
  "status": "ok",
  "groq_model": "openai/gpt-oss-20b"
}
```

## Run Locally

### Backend

```bash
cd backend
python -m venv venv
source venv/Scripts/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Troubleshooting

**The browser reports a CORS error on `/chat`.** This is usually misleading. An unhandled exception in FastAPI produces a 500 response that bypasses the CORS middleware, so the browser reports a missing `Access-Control-Allow-Origin` header rather than the real failure. Check the Render logs first. The most common root causes are a retired Groq model or a missing or invalid `GROQ_API_KEY`.

**The chat returns an error about model availability.** Groq has retired the configured model. Query `https://api.groq.com/openai/v1/models` to see what is currently active, then update `GROQ_MODEL` in your Render environment. No code change or redeploy of the source is needed.

**The first request takes a long time.** The backend runs on Render's free tier, which spins down after inactivity. The first request after an idle period can take 50 seconds or more while the instance wakes up.

## Built by

Shawal Basheer | Mid Sweden University (Mittuniversitetet), Sundsvall, Sweden
