from langchain_groq import ChatGroq
from langchain_core.tools import tool
from langchain_core.messages import HumanMessage, SystemMessage
from weather import get_current_weather
from dotenv import load_dotenv
import os
import json

# Load the API key from .env file
from dotenv import load_dotenv
import os

# This makes sure it finds the .env file correctly
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '.env'))
print("API KEY FOUND:", os.getenv("GROQ_API_KEY") is not None)

# Create the AI brain using Groq
llm = ChatGroq(
    api_key=os.getenv("GROQ_API_KEY"),
    model="llama-3.3-70b-versatile",
    temperature=0.7
)

def ask_agent(question: str) -> str:
    """
    Send a question to VäderAI and get a smart response
    """
    # Check if question is about weather
    weather_keywords = ["weather", "temperature", "rain", "wind", 
                       "humid", "forecast", "hot", "cold", "sunny", "cloudy"]
    
    question_lower = question.lower()
    is_weather_question = any(keyword in question_lower for keyword in weather_keywords)
    
    # Try to extract city name from question
    weather_data = ""
    if is_weather_question:
        # Common cities to check for in the question
        words = question.replace("?", "").replace("!", "").split()
        
        # Try each word and combination as a city name
        for i, word in enumerate(words):
            if word.lower() not in ["what", "is", "the", "in", "at", "for", 
                                     "weather", "temperature", "how", "tell",
                                     "me", "about", "whats", "current", "today"]:
                result = get_current_weather(word)
                if "error" not in result:
                    weather_data = f"""
                    Real weather data for {result['city']}, {result['country']}:
                    Temperature: {result['temperature']}°C
                    Feels like: {result['feels_like']}°C
                    Humidity: {result['humidity']}%
                    Wind speed: {result['wind_speed']} km/h
                    """
                    break
    
    # Build messages for the AI
    messages = [
        SystemMessage(content="""You are VäderAI, a smart and friendly weather 
        intelligence assistant. You help users understand weather conditions 
        around the world. Always be helpful, clear and conversational.
        If real weather data is provided, use it in your response.
        Present weather information in a friendly and easy to understand way."""),
        HumanMessage(content=f"""
        User question: {question}
        
        {f'Real weather data: {weather_data}' if weather_data else ''}
        
        Please provide a helpful response.
        """)
    ]
    
    # Get response from AI
    response = llm.invoke(messages)
    return response.content