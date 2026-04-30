# VäderAI - Decision Log

## Decision 1 - Backend Setup
Date: 28 April 2026
Decision: Used Python virtual environment to isolate project dependencies.
Reason: Prevents package conflicts and follows professional development standards.

## Decision 2 - Package Selection
Date: 28 April 2026
Decision: Selected FastAPI, LangChain, Claude API, and Open-Meteo for the backend.
Reason: FastAPI is modern and fast. LangChain simplifies AI agent building. 
Open-Meteo is completely free with no API key required.

## Decision 3 - Weather API
Date: 28 April 2026
Decision: Used Open-Meteo API for all weather data.
Reason: Completely free, no API key required, covers live weather, 
historical data and climate change data globally.

## Decision 4 - AI Model Selection
Date: 30 April 2026
Decision: Used Groq API with llama-3.3-70b-versatile model instead of Claude API.
Reason: Groq is completely free with no credit card required. 
llama3-70b-8192 was decommissioned so switched to llama-3.3-70b-versatile.