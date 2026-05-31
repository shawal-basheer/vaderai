import requests
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import io
import base64
from datetime import datetime

def get_historical_climate(city: str, start_year: int = 1970):
    url = "https://geocoding-api.open-meteo.com/v1/search"
    params = {"name": city, "count": 1, "language": "en", "format": "json"}
    response = requests.get(url, params=params)
    data = response.json()

    if "results" not in data or len(data["results"]) == 0:
        return {"error": f"City '{city}' not found"}

    result = data["results"][0]
    latitude = result["latitude"]
    longitude = result["longitude"]
    city_name = result["name"]
    country = result["country"]

    url = "https://archive-api.open-meteo.com/v1/archive"
    params = {
        "latitude": latitude,
        "longitude": longitude,
        "start_date": f"{start_year}-01-01",
        "end_date": "2023-12-31",
        "daily": ["temperature_2m_mean"],
        "timezone": "auto"
    }

    response = requests.get(url, params=params)
    data = response.json()

    if "daily" not in data:
        return {"error": "Could not fetch historical data"}

    dates = data["daily"]["time"]
    temps = data["daily"]["temperature_2m_mean"]

    yearly_data = {}
    for i, date_str in enumerate(dates):
        if temps[i] is None:
            continue
        year = datetime.strptime(date_str, "%Y-%m-%d").year
        if year not in yearly_data:
            yearly_data[year] = []
        yearly_data[year].append(temps[i])

    years = sorted(yearly_data.keys())
    avg_temps = [round(sum(yearly_data[y]) / len(yearly_data[y]), 2) for y in years]

    n = len(years)
    mean_year = sum(years) / n
    mean_temp = sum(avg_temps) / n
    slope = sum((years[i] - mean_year) * (avg_temps[i] - mean_temp) for i in range(n)) / \
            sum((years[i] - mean_year) ** 2 for i in range(n))
    intercept = mean_temp - slope * mean_year
    trend_line = [slope * y + intercept for y in years]

    temp_change = round(avg_temps[-1] - avg_temps[0], 2)
    change_text = f"+{temp_change}°C" if temp_change > 0 else f"{temp_change}°C"

    fig, ax = plt.subplots(figsize=(16, 5))
    fig.patch.set_facecolor('#1f2937')
    ax.set_facecolor('#1f2937')

    ax.bar(years, avg_temps, color='#3b82f6', alpha=0.7, label='Yearly Average')
    ax.plot(years, trend_line, color='#ef4444', linewidth=2, label=f'Trend ({change_text} since {start_year})')

    ax.set_title(f'Historical Temperature — {city_name}, {country} ({start_year}-2023)',
                 color='white', fontsize=13, pad=15)
    ax.set_xlabel('Year', color='#9ca3af', fontsize=11)
    ax.set_ylabel('Average Temperature (°C)', color='#9ca3af', fontsize=11)
    ax.tick_params(colors='#9ca3af')
    ax.spines['bottom'].set_color('#374151')
    ax.spines['top'].set_color('#374151')
    ax.spines['left'].set_color('#374151')
    ax.spines['right'].set_color('#374151')
    ax.legend(facecolor='#374151', labelcolor='white', fontsize=10)
    ax.grid(axis='y', color='#374151', alpha=0.5)

    plt.tight_layout()

    buffer = io.BytesIO()
    plt.savefig(buffer, format='png', dpi=100, bbox_inches='tight', facecolor='#1f2937')
    buffer.seek(0)
    image_base64 = base64.b64encode(buffer.read()).decode('utf-8')
    plt.close()

    return {
        "city": city_name,
        "country": country,
        "start_year": start_year,
        "temp_change": temp_change,
        "image": image_base64
    }