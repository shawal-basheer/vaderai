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

def get_forecast(city: str):
    """
    Get 7 day temperature forecast for any city
    """
    location = get_coordinates(city)
    
    if not location:
        return {"error": f"City '{city}' not found"}
    
    url = "https://api.open-meteo.com/v1/forecast"
    params = {
        "latitude": location["latitude"],
        "longitude": location["longitude"],
        "daily": [
            "temperature_2m_max",
            "temperature_2m_min",
        ],
        "timezone": "auto",
        "forecast_days": 7
    }
    
    response = requests.get(url, params=params)
    data = response.json()
    
    daily = data["daily"]
    
    forecast = []
    days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    
    for i in range(7):
        from datetime import datetime
        date = datetime.strptime(daily["time"][i], "%Y-%m-%d")
        forecast.append({
            "day": date.strftime("%a"),
            "max": daily["temperature_2m_max"][i],
            "min": daily["temperature_2m_min"][i]
        })
    
    return {
        "city": location["city"],
        "country": location["country"],
        "forecast": forecast
    }

def get_city_from_coordinates(latitude: float, longitude: float):
    """
    Get city name from latitude and longitude
    """
    url = "https://nominatim.openstreetmap.org/reverse"
    params = {
        "lat": latitude,
        "lon": longitude,
        "format": "json"
    }
    headers = {
        "User-Agent": "VäderAI/1.0"
    }
    response = requests.get(url, params=params, headers=headers)
    data = response.json()
    
    city = (
        data.get("address", {}).get("city") or
        data.get("address", {}).get("town") or
        data.get("address", {}).get("village") or
        "Sundsvall"
    )
    return city

def get_weather_alerts(city: str):
    """
    Check for extreme weather conditions in any city
    """
    weather = get_current_weather(city)
    
    if "error" in weather:
        return {"alerts": []}
    
    alerts = []
    
    # Check for extreme heat
    if weather["temperature"] >= 35:
        alerts.append({
            "type": "heat",
            "severity": "high",
            "message": f"Extreme heat warning in {weather['city']}! Temperature is {weather['temperature']}°C"
        })
    
    # Check for freezing temperature
    if weather["temperature"] <= -10:
        alerts.append({
            "type": "cold",
            "severity": "high", 
            "message": f"Extreme cold warning in {weather['city']}! Temperature is {weather['temperature']}°C"
        })
    
    # Check for strong winds
    if weather["wind_speed"] >= 50:
        alerts.append({
            "type": "wind",
            "severity": "high",
            "message": f"Strong wind warning in {weather['city']}! Wind speed is {weather['wind_speed']} km/h"
        })
    
    # Check for high humidity
    if weather["humidity"] >= 90:
        alerts.append({
            "type": "humidity",
            "severity": "medium",
            "message": f"Very high humidity in {weather['city']}! Humidity is {weather['humidity']}%"
        })

    return {"city": weather["city"], "alerts": alerts}