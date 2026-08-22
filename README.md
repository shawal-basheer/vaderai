# VäderAI 🌤️

An AI-powered global weather intelligence agent built with React and FastAPI.

## Live Demo
🔗 [vader-ai.vercel.app](https://vader-ai.vercel.app)

## Features
-  Real-time global weather for any city
-  7 day forecast with weather icons
-  Historical climate data with Matplotlib charts
-  Natural language AI chat powered by Groq
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
- **AI** - LangChain, Groq API
- **Data** - Open-Meteo API (live, historical, climate)
- **Visualization** - Matplotlib
- **Hosting** - Vercel + Render

## Groq model configuration
Groq retires models periodically. Rather than hardcoding a model in the code, this backend reads the model name from the GROQ_MODEL environment variable. If GROQ_MODEL is not provided, the backend defaults to "openai/gpt-oss-20b".

To view available models from Groq, you can query:
https://api.groq.com/openai/v1/models

When a Groq model is deprecated or inaccessible you should update the GROQ_MODEL value in your environment (for example, in the Render dashboard) rather than changing code.

## Run Locally

### Backend
```bash
cd backend
python -m venv venv
source venv/Scripts/activate
pip install -r requirements.txt
uvicorn main:app --reload
