function WeatherCard({ darkMode, weather, loading }) {
  if (loading) {
    return (
      <div className={`rounded-2xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} animate-pulse`}>
        <div className="h-8 bg-gray-600 rounded w-1/3 mb-4"></div>
        <div className="h-16 bg-gray-600 rounded w-1/4 mb-4"></div>
        <div className="h-4 bg-gray-600 rounded w-1/2"></div>
      </div>
    )
  }

  if (!weather) return null

  return (
    <div className={`rounded-2xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-md'}`}>
      
      {/* City and country */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {weather.city}, {weather.country}
          </h2>
          <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Current Weather
          </p>
        </div>
        <div className="text-5xl font-bold text-blue-400">
          {weather.temperature}°C
        </div>
      </div>

      {/* Feels like */}
      <p className={`text-sm mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        Feels like {weather.feels_like}°C
      </p>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        
        <div className={`rounded-xl p-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <p className={`text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Humidity
          </p>
          <p className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {weather.humidity}%
          </p>
        </div>

        <div className={`rounded-xl p-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <p className={`text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Wind Speed
          </p>
          <p className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {weather.wind_speed} km/h
          </p>
        </div>

        <div className={`rounded-xl p-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <p className={`text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Feels Like
          </p>
          <p className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {weather.feels_like}°C
          </p>
        </div>

      </div>
    </div>
  )
}

export default WeatherCard