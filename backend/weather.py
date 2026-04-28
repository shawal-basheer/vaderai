import requests

def get_coordinates(city: str):
    """
    Get latitude and longitude for any city name
    Uses Open-Meteo geocoding API - completely free!
    """
    url = "https://geocoding-api.open-meteo.com/v1/search"
    params = {
        "name": city,
        "count": 1,
        "language": "en",
        "format": "json"
    }
    response = requests.get(url, params=params)
    data = response.json()
    
    if "results" not in data or len(data["results"]) == 0:
        return None
    
    result = data["results"][0]
    return {
        "city": result["name"],
        "country": result["country"],
        "latitude": result["latitude"],
        "longitude": result["longitude"]
    }

def get_current_weather(city: str):
    """
    Get current weather for any city in the world
    """
    # First get coordinates for the city
    location = get_coordinates(city)
    
    if not location:
        return {"error": f"City '{city}' not found"}
    
    # Then get weather for those coordinates
    url = "https://api.open-meteo.com/v1/forecast"
    params = {
        "latitude": location["latitude"],
        "longitude": location["longitude"],
        "current": [
            "temperature_2m",
            "relative_humidity_2m", 
            "wind_speed_10m",
            "weather_code",
            "apparent_temperature"
        ],
        "timezone": "auto"
    }
    
    response = requests.get(url, params=params)
    data = response.json()
    
    current = data["current"]
    
    return {
        "city": location["city"],
        "country": location["country"],
        "temperature": current["temperature_2m"],
        "feels_like": current["apparent_temperature"],
        "humidity": current["relative_humidity_2m"],
        "wind_speed": current["wind_speed_10m"],
        "weather_code": current["weather_code"]
    }