# VäderAI 🌤️

An AI-powered global weather intelligence agent built with React and FastAPI.

## Live Demo
🔗 [vader-ai.vercel.app](https://vader-ai.vercel.app)

## Features
-  Real-time global weather for any city
-  7 day forecast with weather icons
-  Historical climate data with Matplotlib charts
-  Natural language AI chat powered by Groq LLaMA 3.3
-  Extreme weather alerts
-  City comparison
-  Travel weather advisor
-  Climate change insights
-  Text to speech responses
-  Auto location detection
-  Dark and light mode

## Tech Stack
- **Frontend** - React, Vite, Tailwind CSS, Recharts
- **Backend** - Python, FastAPI
- **AI** - LangChain, Groq API (LLaMA 3.3 70B)
- **Data** - Open-Meteo API (live, historical, climate)
- **Visualization** - Matplotlib
- **Hosting** - Vercel + Render

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

## Built by
Shawal Basheer | Mid Sweden University (Mittuniversitetet), Sundsvall, Sweden