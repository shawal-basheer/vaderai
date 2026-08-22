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
Superseded by Decision 11 (22 August 2026).

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

## Decision 11 - Groq model configuration and resilience
Date: 22 August 2026
Decision: Move Groq model selection out of source code and into configuration (GROQ_MODEL environment variable). Default to "openai/gpt-oss-20b" when not provided.
Reason: During 2026 the project experienced two Groq model retirements (llama3-70b-8192 and later llama-3.3-70b-versatile). Because Groq retires and replaces models periodically, hardcoding a model in source caused production outages and repeated code changes. Making the model configurable means future deprecations can be handled by updating environment settings (Render dashboard) instead of code changes and redeploys.
Notes: The project chose openai/gpt-oss-20b as the default because it offers a balance between cost/free-tier limits and capability for concise weather summaries; openai/gpt-oss-120b is a larger reasoning model but has different cost/rate characteristics and may be overkill for short weather responses. Operators should be aware that different model families may vary in response style and should test the model they choose. The backend also adds a global exception handler and a health endpoint to make model failures visible in logs and to prevent misleading CORS errors surfacing to the frontend.
