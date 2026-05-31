function WeatherCard({ darkMode, weather, loading }) {
  if (loading) {
    return (
      <div className={`rounded-xl p-4 animate-pulse flex-shrink-0 ${darkMode ? 'bg-gray-900' : 'bg-white shadow-md'}`}>
        <div className="h-5 bg-gray-700 rounded w-1/2 mb-3"></div>
        <div className="h-10 bg-gray-700 rounded w-1/3 mb-3"></div>
        <div className="h-4 bg-gray-700 rounded w-2/3"></div>
      </div>
    )
  }

  if (!weather) return null

  return (
    <div className={`rounded-xl p-4 flex-shrink-0 ${darkMode ? 'bg-gray-900' : 'bg-white shadow-md'}`}>
      
      {/* City and temp */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <h2 className={`text-base font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {weather.city}, {weather.country}
          </h2>
          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Current Weather · Feels like {weather.feels_like}°C
          </p>
        </div>
        <div className="text-4xl font-bold text-blue-400">
          {weather.temperature}°C
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2">
        <div className={`rounded-lg p-2 text-center ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Humidity</p>
          <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{weather.humidity}%</p>
        </div>
        <div className={`rounded-lg p-2 text-center ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Wind</p>
          <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{weather.wind_speed} km/h</p>
        </div>
        <div className={`rounded-lg p-2 text-center ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Feels Like</p>
          <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{weather.feels_like}°C</p>
        </div>
      </div>

    </div>
  )
}

export default WeatherCard