# VäderAI - System Architecture and Wireframes

## 1. System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          USER INTERFACE LAYER                           │
│                         React.js Frontend (Vercel)                      │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │  Browser Application (Responsive: Desktop, Tablet, Mobile)        │ │
│  │  ┌─────────────┐  ┌──────────────┐  ┌──────────────────────────┐ │ │
│  │  │   Navbar    │  │  Weather     │  │   Chat Box               │ │ │
│  │  │  (Branding) │  │   Display    │  │  (Natural Language)      │ │ │
│  │  └─────────────┘  └──────────────┘  └──────────────────────────┘ │ │
│  │  ┌─────────────────────┐  ┌──────────────────────────────────────┐ │ │
│  │  │  Alert Banner       │  │  Dynamic Content (based on query)   │ │ │
│  │  │  (Extreme Weather)  │  │  - Forecast Chart                  │ │ │
│  │  └─────────────────────┘  │  - Climate Chart                   │ │ │
│  │                            │  - Comparison Card                 │ │ │
│  │                            │  - Travel Recommendations          │ │ │
│  │                            └──────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
                                    | HTTP/JSON
┌─────────────────────────────────────────────────────────────────────────┐
│                      APPLICATION LAYER (API)                            │
│                   FastAPI Backend (Python on Render)                    │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │  ROUTING LAYER                                                     │ │
│  │  |- GET /weather/{city}        Current weather                    │ │
│  │  |- GET /forecast/{city}       7-day forecast                     │ │
│  │  |- GET /alerts/{city}         Extreme weather alerts             │ │
│  │  |- GET /climate/{city}        Historical climate data            │ │
│  │  |- GET /travel/{city}         Travel recommendations             │ │
│  │  |- GET /compare               City comparison                    │ │
│  │  |- POST /chat                 AI agent processing                │ │
│  │  |- GET /location              Geolocation reverse lookup         │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │  AI AGENT LAYER (LangChain + Groq)                                │ │
│  │  ┌──────────────────────────────────────────────────────────────┐ │ │
│  │  │  Natural Language Processing                                 │ │ │
│  │  │  - Parse user query                                          │ │ │
│  │  │  - Identify intent (weather/climate/compare/travel)          │ │ │
│  │  │  - Generate structured response (RESPONSE/ACTION/DATA)       │ │ │
│  │  │  - Route to appropriate API tool                             │ │ │
│  │  └──────────────────────────────────────────────────────────────┘ │ │
│  │                                                                    │ │
│  │  AVAILABLE TOOLS:                                                │ │
│  │  - weather_tool()    Fetch current weather                       │ │
│  │  - climate_tool()    Fetch historical climate                    │ │
│  │  - compare_tool()    Compare two cities                          │ │
│  │  - travel_tool()     Get travel recommendations                  │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │  DATA PROCESSING LAYER                                             │ │
│  │  |- weather.py       Weather API integration                      │ │
│  │  |- climate.py       Climate data and visualization               │ │
│  │  |- agent.py         LangChain agent setup                        │ │
│  │  |- config.py        Environment and settings                     │ │
│  └────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
                                    | HTTPS
┌─────────────────────────────────────────────────────────────────────────┐
│                        EXTERNAL API LAYER                               │
│                          (Open-Meteo and Groq)                          │
│  ┌──────────────────────┐  ┌──────────────────┐  ┌─────────────────┐  │
│  │  Open-Meteo          │  │  Groq LLM API    │  │  Geocoding API  │  │
│  │  Forecast API        │  │  (Llama 3.3)     │  │  (Location      │  │
│  │  (Current weather)   │  │  - AI inference  │  │   to Coords)    │  │
│  │                      │  │  - Context aware │  │                 │  │
│  │  Archive API         │  │    responses     │  │                 │  │
│  │  (Historical 1940+)  │  │                  │  │                 │  │
│  │                      │  │                  │  │                 │  │
│  │  Climate API         │  │                  │  │                 │  │
│  │  (1950-2050)         │  │                  │  │                 │  │
│  └──────────────────────┘  └──────────────────┘  └─────────────────┘  │
│                         All Free Tier APIs                             │
└─────────────────────────────────────────────────────────────────────────┘
                                    |
┌─────────────────────────────────────────────────────────────────────────┐
│                        DATA SOURCE LAYER                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌────────────┐ │
│  │   NOAA       │  │   DWD        │  │   Real-time  │  │   Climate  │ │
│  │   Weather    │  │   Weather    │  │   Data       │  │   Models   │ │
│  │   Data       │  │   Data       │  │   Networks   │  │   (IPCC)   │ │
│  └──────────────┘  └──────────────┘  └──────────────┘  └────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 2. API Data Flow Diagram

### Flow 1: User Asks for Current Weather

```
User Input: "What's the weather in Tokyo?"
        |
[Chat Component sends query to Backend]
        |
POST /chat -> {"message": "What's the weather in Tokyo?"}
        |
[LangChain Agent processes query]
        |
Agent Decision Tree:
|- Intent: WEATHER (confirmed)
|- Extract City: Tokyo (confirmed)
|- Tool Selected: weather_tool() (confirmed)
        |
[Call weather_tool("Tokyo")]
        |
GET /weather/Tokyo
        |
[Backend Logic]
|- city="Tokyo" -> Geocoding API
|  | response: {lat: 35.67, lon: 139.69}
|- coordinates -> Open-Meteo Forecast API
|  | response: {temp: 22C, humidity: 65%, ...}
|- city -> Open-Meteo Alerts API
|  | response: {alerts: []}
        |
[Format Response]
RESPONSE: "Currently in Tokyo: 22C, 65% humidity, Partly Cloudy"
ACTION: "show_weather"
DATA: "Tokyo"
        |
JSON Response to Frontend:
{
  "response": "Currently in Tokyo: 22C, 65% humidity, Partly Cloudy",
  "action": "show_weather",
  "data": {
    "city": "Tokyo",
    "temperature": 22,
    "humidity": 65,
    "conditions": "Partly Cloudy"
  }
}
        |
[Frontend Updates Display]
|- Update WeatherCard with Tokyo data
|- Show current conditions
|- Display 7-day forecast
|- Tab title changes to "Tokyo - VäderAI"
        |
Display Result to User (Success)
```

### Flow 2: User Asks for Climate Insights

```
User Input: "How has Stockholm warmed since 1970?"
        |
POST /chat -> {"message": "How has Stockholm warmed since 1970?"}
        |
[LangChain Agent processes query]
        |
Agent Decision Tree:
|- Intent: CLIMATE (confirmed)
|- Extract City: Stockholm (confirmed)
|- Extract Date: 1970 (confirmed)
|- Tool Selected: climate_tool() (confirmed)
        |
GET /climate/Stockholm?start_year=1970
        |
[Backend Logic]
|- city="Stockholm" -> Geocoding API -> {lat: 59.33, lon: 18.07}
|- coordinates + 1970-2023 -> Open-Meteo Archive API
|  | response: [daily temps for 50+ years]
|- Calculate: yearly averages, trend line, temperature change
|  | 1970 avg: 6.2C
|  | 2023 avg: 8.0C
|  | Change: +1.8C (29% increase)
|- Generate chart with Matplotlib
|  | save as image
        |
[Format Response]
RESPONSE: "Stockholm has warmed by 1.8C since 1970. 
This represents a 29% increase. The warming trend is accelerating, 
especially in winter months."
ACTION: "show_climate"
DATA: "Stockholm"
        |
JSON Response with embedded chart image
        |
[Frontend Updates Display]
|- Hide forecast chart
|- Show ClimateChart component
|- Display warming trend visualization
|- Show statistics box
|- Tab title changes to "Stockholm - VäderAI"
        |
Display Climate Insights (Success)
```

### Flow 3: User Compares Two Cities

```
User Input: "Compare weather in London and Barcelona"
        |
POST /chat
        |
[LangChain Agent processes query]
        |
Agent Decision Tree:
|- Intent: COMPARE (confirmed)
|- Extract Cities: London, Barcelona (confirmed)
|- Tool Selected: compare_tool() (confirmed)
        |
GET /compare?city1=London&city2=Barcelona
        |
[Backend Logic - Parallel Execution]
|- GET /weather/London -> {temp: 15C, humidity: 72%, wind: 12 km/h}
|- GET /weather/Barcelona -> {temp: 22C, humidity: 65%, wind: 8 km/h}
        |
[Format Comparison]
RESPONSE: "Barcelona is warmer (22C vs 15C) and less windy than London today.
Perfect day for outdoor activities in Barcelona!"
ACTION: "show_compare"
DATA: "London,Barcelona"
        |
JSON Response with both cities' data
        |
[Frontend Updates Display]
|- Show CompareCard component
|- Display side-by-side comparison
|- Highlight differences
|- Tab title changes to "London - VäderAI"
        |
Display Comparison (Success)
```

---

## 3. UI Wireframes

### Wireframe 1: Initial Load Screen

```
┌────────────────────────────────────────────────────────────┐
│  [Logo]  VäderAI              [Dark Mode Toggle]  [📍]     │  <- Navbar
├────────────────────────────────────────────────────────────┤
│                                                            │
│  ┌──────────────────────┐  ┌──────────────────────────┐   │
│  │                      │  │                          │   │
│  │   WEATHER CARD       │  │   7-DAY FORECAST        │   │
│  │                      │  │   (Chart)               │   │
│  │   Stockholm          │  │                          │   │
│  │   22C                │  │   Mon: 18C - 23C         │   │
│  │   Partly Cloudy      │  │   Tue: 17C - 22C         │   │
│  │   Humidity: 65%      │  │   Wed: 16C - 20C         │   │
│  │   Wind: 8 km/h       │  │   ...                    │   │
│  │                      │  │                          │   │
│  └──────────────────────┘  └──────────────────────────┘   │
│                                                            │
│  ┌──────────────────────┐                                 │
│  │                      │                                 │
│  │   CHAT BOX           │                                 │
│  │                      │                                 │
│  │   "What's the        │                                 │
│  │    weather in..."    │                                 │
│  │                      │                                 │
│  │   [Type message...] │  [Send]                         │
│  │                      │                                 │
│  └──────────────────────┘                                 │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

### Wireframe 2: After User Asks About Climate

```
┌────────────────────────────────────────────────────────────┐
│  [Logo]  VäderAI              [Dark Mode Toggle]  [📍]     │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  ┌──────────────────────┐  ┌──────────────────────────┐   │
│  │                      │  │                          │   │
│  │   WEATHER CARD       │  │   CLIMATE CHART          │   │
│  │   Stockholm          │  │   (Dynamically Added)    │   │
│  │   22C                │  │                          │   │
│  │   Partly Cloudy      │  │   Temperature Trend      │   │
│  │                      │  │   Stockholm 1970-2023    │   │
│  │                      │  │                          │   │
│  │                      │  │   [Line Chart Graph]     │   │
│  │                      │  │                          │   │
│  │                      │  │   +1.8C (29% warmer)     │   │
│  │                      │  │   Trend: Accelerating    │   │
│  │                      │  │                          │   │
│  └──────────────────────┘  └──────────────────────────┘   │
│                                                            │
│  ┌──────────────────────┐                                 │
│  │ AI: Stockholm has    │                                 │
│  │ warmed by 1.8C       │                                 │
│  │ since 1970...        │                                 │
│  │                      │                                 │
│  │ [Type message...] [Send]                              │
│  └──────────────────────┘                                 │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

### Wireframe 3: Comparison View

```
┌────────────────────────────────────────────────────────────┐
│  [Logo]  VäderAI              [Dark Mode Toggle]  [📍]     │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  ┌──────────────────────┐  ┌──────────────────────────┐   │
│  │                      │  │                          │   │
│  │   WEATHER CARD       │  │   COMPARISON CARD        │   │
│  │   London             │  │   (Replaces Forecast)    │   │
│  │   15C                │  │                          │   │
│  │   Cloudy             │  │  LONDON    vs   BARCELONA│   │
│  │   Humidity: 72%      │  │  ─────────     ─────────│   │
│  │   Wind: 12 km/h      │  │  15C            22C      │   │
│  │                      │  │  72% humidity   65%      │   │
│  │                      │  │  12 km/h        8 km/h   │   │
│  │                      │  │  Cloudy         Sunny    │   │
│  │                      │  │                          │   │
│  │                      │  │  Result: Barcelona is    │   │
│  │                      │  │  warmer!                 │   │
│  │                      │  │                          │   │
│  └──────────────────────┘  └──────────────────────────┘   │
│                                                            │
│  ┌──────────────────────┐                                 │
│  │ AI: Barcelona is     │                                 │
│  │ warmer and sunnier   │                                 │
│  │ than London today.   │                                 │
│  │                      │                                 │
│  │ [Type message...] [Send]                              │
│  └──────────────────────┘                                 │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

### Wireframe 4: Mobile View (Responsive)

```
┌────────────────┐
│ [Menu] VäderAI │  <- Navbar (hamburger menu on mobile)
│        [Theme] │
├────────────────┤
│                │
│ ┌────────────┐ │
│ │ WEATHER    │ │
│ │ Stockholm  │ │
│ │ 22C        │ │
│ │ Cloudy     │ │
│ └────────────┘ │
│                │
│ ┌────────────┐ │
│ │ 7-DAY      │ │
│ │ FORECAST   │ │
│ │ (Scrollable)  │
│ │ Mon: 18-23 │ │
│ │ Tue: 17-22 │ │
│ └────────────┘ │
│                │
│ ┌────────────┐ │
│ │ CHAT BOX   │ │
│ │ "Weather   │ │
│ │  in..."    │ │
│ │            │ │
│ │ [Send]     │ │
│ └────────────┘ │
│                │
└────────────────┘
```

---

## 4. Data Model / Structure Diagram

Since VäderAI is stateless (no database), here is the data flow structure:

```
┌─────────────────────────────────────────────────────────────┐
│                    USER REQUEST                             │
│  {                                                          │
│    message: string,                                         │
│    timestamp: datetime,                                     │
│    session_id: uuid                                         │
│  }                                                          │
└────────────────────┬────────────────────────────────────────┘
                     |
┌─────────────────────────────────────────────────────────────┐
│              AI AGENT PROCESSING                            │
│  {                                                          │
│    input: string,                                           │
│    intent: [weather|climate|compare|travel],               │
│    entities: [city1, city2, year],                         │
│    confidence: float                                        │
│  }                                                          │
└────────────────────┬────────────────────────────────────────┘
                     |
       ┌─────────────┴─────────────┬──────────────┬────────────┐
       |                           |              |            |
   WEATHER DATA            CLIMATE DATA     COMPARE DATA    TRAVEL DATA
   {                       {                {              {
     city: string,          city: string,   city1: string, city: string,
     temp: float,           year_start: int city2: string, month: string,
     humidity: int,         year_end: int,  data1: {...},  best_months:[],
     wind: float,           avg_change: float data2: {...} avg_temp: float,
     conditions: string,    trend: string,  comparison:{}  humidity: int
     alerts: []             chart_url: url  }              conditions:[]
   }                        }                              }
       |                           |              |            |
       └─────────────┬─────────────┴──────────────┴────────────┘
                     |
┌─────────────────────────────────────────────────────────────┐
│              AGENT RESPONSE FORMAT                          │
│  {                                                          │
│    response: string,         // Natural language answer    │
│    action: string,           // UI action (show_weather...)│
│    data: object,             // Relevant data              │
│    suggestions: [string]     // Follow-up suggestions      │
│  }                                                          │
└────────────────────┬────────────────────────────────────────┘
                     |
┌─────────────────────────────────────────────────────────────┐
│              FRONTEND DISPLAY                               │
│  Based on 'action' field:                                  │
│  - show_weather -> WeatherCard + ForecastChart             │
│  - show_climate -> ClimateChart                            │
│  - show_compare -> CompareCard                             │
│  - show_travel -> TravelCard                               │
│  - none -> Just display response text                      │
└─────────────────────────────────────────────────────────────┘
```

---

## Summary

System Architecture: Shows 4 layers (UI, API, AI, External APIs)
Data Flow: 3 realistic user scenarios
Wireframes: 4 different views (desktop, mobile, climate, compare)
Data Model: Request to Processing to Response to Display
```
