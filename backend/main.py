from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from weather import get_current_weather

# Create the FastAPI app
app = FastAPI(
    title="VäderAI",
    description="AI Powered Weather Intelligence Agent",
    version="1.0.0"
)

# Allow frontend to talk to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Test route - just to check everything is working
@app.get("/")
def home():
    return {"message": "Welcome to VäderAI!", "status": "running"}

# Weather route - get current weather for any city
@app.get("/weather/{city}")
def weather(city: str):
    """
    Get current weather for any city
    Example: /weather/London
    """
    result = get_current_weather(city)
    return result