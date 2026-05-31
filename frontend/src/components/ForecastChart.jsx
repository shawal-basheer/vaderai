const getWeatherEmoji = (max) => {
  if (max >= 35) return '🌡️'
  if (max >= 25) return '☀️'
  if (max >= 18) return '⛅'
  if (max >= 10) return '🌤️'
  if (max >= 3) return '🌧️'
  if (max >= 0) return '🌨️'
  return '❄️'
}

const getWeatherDesc = (max) => {
  if (max >= 35) return 'Very Hot'
  if (max >= 25) return 'Sunny'
  if (max >= 18) return 'Partly Cloudy'
  if (max >= 10) return 'Mild'
  if (max >= 3) return 'Rainy'
  if (max >= 0) return 'Snowy'
  return 'Freezing'
}

function ForecastChart({ darkMode, forecast }) {
  if (!forecast || forecast.length === 0) return null

  return (
    <div className={`rounded-xl p-5 h-full flex flex-col ${darkMode ? 'bg-gray-900' : 'bg-white shadow-md'}`}>
      <h3 className={`text-sm font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        7 Day Forecast
      </h3>
      <div className="flex gap-3 h-48">
        {forecast.map((day, i) => (
          <div
            key={i}
            className={`flex-1 flex flex-col items-center justify-center gap-2 rounded-xl p-3 transition-all
              ${i === 0
                ? darkMode ? 'bg-blue-900 bg-opacity-40 border border-blue-500' : 'bg-blue-50 border border-blue-300'
                : darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-50 hover:bg-gray-100'
              }`}
          >
            <span className={`text-xs font-bold ${i === 0 ? 'text-blue-400' : darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {i === 0 ? 'Today' : day.day}
            </span>
            <span className="text-3xl">{getWeatherEmoji(day.max)}</span>
            <span className={`text-xs text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {getWeatherDesc(day.max)}
            </span>
            <div className="flex gap-1.5 items-center">
              <span className="text-sm font-bold text-red-400">{day.max}°</span>
              <span className="text-xs text-blue-400">{day.min}°</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ForecastChart