from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from weather import get_current_weather, get_forecast, get_city_from_coordinates, get_weather_alerts
from agent import ask_agent
from pydantic import BaseModel

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

# Model for chat request
class ChatRequest(BaseModel):
    message: str

# Test route
@app.get("/")
def home():
    return {"message": "Welcome to VäderAI!", "status": "running"}

# Weather route
@app.get("/weather/{city}")
def weather(city: str):
    result = get_current_weather(city)
    return result

# Forecast route
@app.get("/forecast/{city}")
def forecast(city: str):
    result = get_forecast(city)
    return result

# Location route
@app.get("/location")
def location(lat: float, lon: float):
    city = get_city_from_coordinates(lat, lon)
    return {"city": city}

# Alerts route
@app.get("/alerts/{city}")
def alerts(city: str):
    result = get_weather_alerts(city)
    return result

# Chat route
@app.post("/chat")
def chat(request: ChatRequest):
    response = ask_agent(request.message)
    return {"response": response}