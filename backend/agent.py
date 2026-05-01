from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage, SystemMessage
from weather import get_current_weather, get_forecast, get_weather_alerts, compare_cities, get_travel_advice
from dotenv import load_dotenv
import os
import json
import re

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '.env'))

llm = ChatGroq(
    api_key=os.getenv("GROQ_API_KEY"),
    model="llama-3.3-70b-versatile",
    temperature=0.7
)

def extract_action(text):
    """
    Extract JSON action from AI response if present
    """
    try:
        match = re.search(r'\{.*?\}', text, re.DOTALL)
        if match:
            return json.loads(match.group())
    except:
        pass
    return None

def ask_agent(question: str) -> dict:
    """
    Send a question to VäderAI and get a smart response with action
    """
    messages = [
        SystemMessage(content="""You are VäderAI, a smart and friendly weather 
        intelligence assistant. You help users with weather and travel planning.
        
        You must ALWAYS respond in this exact format:
        
        RESPONSE: [your natural friendly response here]
        ACTION: [one of: show_weather, show_travel, show_compare, none]
        DATA: [city name, or city1,city2 for compare, or none]
        
        RULES FOR ACTIONS:
        - show_weather: when user asks about current weather in a SPECIFIC city
        - show_travel: when user asks about best time to visit a SPECIFIC city
        - show_compare: when user asks to compare TWO specific cities
        - none: for general questions, country questions, or when asking for clarification
        
        RULES FOR RESPONSES:
        - Always answer directly and naturally
        - If user mentions a country not a city, ask which specific city in a friendly way
        - For general weather questions answer from your knowledge
        - Never say 'How can I help?' just answer directly
        - Be conversational and friendly
        
        EXAMPLES:
        
        User: what is the weather in Tokyo?
        RESPONSE: Let me check the current weather in Tokyo for you!
        ACTION: show_weather
        DATA: Tokyo
        
User: best time to visit Paris?
RESPONSE: Paris is beautiful year round! Spring (April-June) and Fall (September-October) are the best times to visit with mild temperatures around 15-20°C and fewer crowds. Summers can get hot and touristy. I have pulled up the full monthly breakdown for you below!
ACTION: show_travel
DATA: Paris
        
        User: compare London and Dubai
        RESPONSE: Great comparison! Let me pull up both cities for you.
        ACTION: show_compare
        DATA: London,Dubai
        
        User: best time to visit Italy?
        RESPONSE: Italy is a wonderful destination! It has many amazing cities though. Are you thinking of Rome, Milan, Venice, or Florence?
        ACTION: none
        DATA: none
        
        User: will it rain tomorrow?
        RESPONSE: To give you accurate rain forecast I need to know your city. Which city are you in?
        ACTION: none
        DATA: none
        
        User: what is humidity?
        RESPONSE: Humidity is the amount of water vapor present in the air...
        ACTION: none
        DATA: none"""),
        HumanMessage(content=question)
    ]

    response = llm.invoke(messages)
    raw = response.content

    # Parse the structured response
    response_text = ""
    action = "none"
    data = "none"

    for line in raw.split('\n'):
        if line.startswith('RESPONSE:'):
            response_text = line.replace('RESPONSE:', '').strip()
        elif line.startswith('ACTION:'):
            action = line.replace('ACTION:', '').strip().lower()
        elif line.startswith('DATA:'):
            data = line.replace('DATA:', '').strip()

    # If parsing failed just return the raw response
    if not response_text:
        response_text = raw

    return {
        "response": response_text,
        "action": action,
        "data": data
    }