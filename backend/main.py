from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from weather import get_current_weather, get_forecast, get_city_from_coordinates, get_weather_alerts, compare_cities, get_travel_advice
from climate import get_historical_climate
from agent import ask_agent, explain_climate
from pydantic import BaseModel

app = FastAPI(
    title="VäderAI",
    description="AI Powered Weather Intelligence Agent",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str

@app.get("/")
def home():
    return {"message": "Welcome to VäderAI!", "status": "running"}

@app.get("/weather/{city}")
def weather(city: str):
    result = get_current_weather(city)
    return result

@app.get("/forecast/{city}")
def forecast(city: str):
    result = get_forecast(city)
    return result

@app.get("/location")
def location(lat: float, lon: float):
    from weather import get_city_from_coordinates
    city = get_city_from_coordinates(lat, lon)
    return {"city": city}

@app.get("/alerts/{city}")
def alerts(city: str):
    result = get_weather_alerts(city)
    return result

@app.get("/compare")
def compare(city1: str, city2: str):
    result = compare_cities(city1, city2)
    return result

@app.get("/travel/{city}")
def travel(city: str):
    result = get_travel_advice(city)
    return result

@app.get("/climate/{city}")
def climate(city: str, start_year: int = 1970):
    result = get_historical_climate(city, start_year)
    if "error" not in result:
        explanation = explain_climate(result["city"], result["temp_change"], start_year)
        result["explanation"] = explanation
    return result

@app.post("/chat")
def chat(request: ChatRequest):
    result = ask_agent(request.message)
    return result