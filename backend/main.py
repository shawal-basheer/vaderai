from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from weather import get_current_weather
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

# Weather route - get raw weather data
@app.get("/weather/{city}")
def weather(city: str):
    result = get_current_weather(city)
    return result

# Chat route - talk to the AI agent
@app.post("/chat")
def chat(request: ChatRequest):
    """
    Send a message to VäderAI agent
    Example: {"message": "What is the weather in Tokyo?"}
    """
    response = ask_agent(request.message)
    return {"response": response}