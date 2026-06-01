# VäderAI — Decision Log

## Decision 1 - Backend Setup
Date: 28 April 2026
Decision: Used Python virtual environment to isolate project dependencies.
Reason: Prevents package conflicts and follows professional development standards.

## Decision 2 - Package Selection
Date: 28 April 2026
Decision: Selected FastAPI, LangChain, Groq API, and Open-Meteo for the backend.
Reason: FastAPI is modern and fast. LangChain simplifies AI agent building.
Open-Meteo is completely free with no API key required.

## Decision 3 - Weather API
Date: 28 April 2026
Decision: Used Open-Meteo API for ALL weather data including live, historical and climate.
Reason: Completely free, no API key required, covers live weather, historical data
and climate change data globally. Professor recommended it.

## Decision 4 - AI Model Selection
Date: 30 April 2026
Decision: Used Groq API with llama-3.3-70b-versatile model instead of Claude API.
Reason: Groq is completely free with no credit card required.
Claude API requires payment after free credits expire.
llama3-70b-8192 was decommissioned so switched to llama-3.3-70b-versatile.

## Decision 5 - Frontend Framework
Date: 1 May 2026
Decision: Used React with Vite and Tailwind CSS for the frontend.
Reason: React is the most popular frontend framework for building interactive UIs.
Vite is faster than create-react-app. Tailwind makes styling quick and consistent.

## Decision 6 - UI Design Approach
Date: 2 May 2026
Decision: Chose minimal smart dashboard where content loads based on chat input.
Reason: Progressive disclosure principle — only show what the user needs.
Makes the app feel intelligent rather than overwhelming.

## Decision 7 - Data Visualization
Date: 5 May 2026
Decision: Used Matplotlib for historical climate charts and Recharts for forecast.
Reason: Matplotlib is Python-based and handles large historical datasets well.
Recharts is JavaScript-based and provides interactive charts in the browser.
Professor specifically recommended Matplotlib.

## Decision 8 - AI Agent Architecture
Date: 7 May 2026
Decision: Backend returns structured RESPONSE/ACTION/DATA format to frontend.
Reason: Allows the AI to control what appears on the dashboard intelligently.
Prevents hardcoded keyword matching and makes the system truly AI-driven.

## Decision 9 - Deployment
Date: 31 May 2026
Decision: Deployed frontend on Vercel and backend on Render.
Reason: Both are free, easy to set up, and support the required tech stacks.
Vercel excels at React deployments. Render handles Python backends well.

## Decision 10 - Text to Speech
Date: 15 May 2026
Decision: Used Web Speech API for text to speech feature.
Reason: Built into every browser, completely free, zero setup required.
ElevenLabs considered but Web Speech API sufficient for project scope.