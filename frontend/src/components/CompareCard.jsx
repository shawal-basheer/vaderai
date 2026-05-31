function CompareCard({ darkMode, compareData }) {
  if (!compareData) return null

  const { city1, city2, comparison } = compareData

  const getTempColor = (temp) => {
    if (temp >= 35) return 'text-red-500'
    if (temp >= 25) return 'text-orange-400'
    if (temp >= 15) return 'text-yellow-400'
    if (temp >= 5) return 'text-blue-400'
    return 'text-cyan-300'
  }

  const getTempEmoji = (temp) => {
    if (temp >= 35) return '🔥'
    if (temp >= 25) return '☀️'
    if (temp >= 15) return '⛅'
    if (temp >= 5) return '🌤️'
    return '❄️'
  }

  const StatRow = ({ icon, label, value, darkMode }) => (
    <div className={`flex items-center justify-between py-2 border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
      <span className={`text-xs flex items-center gap-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        {icon} {label}
      </span>
      <span className={`text-xs font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{value}</span>
    </div>
  )

  return (
    <div className={`rounded-xl p-5 ${darkMode ? 'bg-gray-900' : 'bg-white shadow-md'}`}>

      <h3 className={`text-sm font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        🔄 City Comparison
      </h3>

      <div className="grid grid-cols-3 gap-4">

        {/* City 1 */}
        <div className={`rounded-xl p-4 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
          <div className="text-center mb-3">
            <p className={`text-base font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{city1.city}</p>
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{city1.country}</p>
          </div>
          <div className="text-center mb-4">
            <p className="text-3xl mb-1">{getTempEmoji(city1.temperature)}</p>
            <p className={`text-4xl font-bold ${getTempColor(city1.temperature)}`}>{city1.temperature}°C</p>
          </div>
          <StatRow icon="🌡️" label="Feels like" value={`${city1.feels_like}°C`} darkMode={darkMode} />
          <StatRow icon="💧" label="Humidity" value={`${city1.humidity}%`} darkMode={darkMode} />
          <StatRow icon="💨" label="Wind" value={`${city1.wind_speed} km/h`} darkMode={darkMode} />
        </div>

        {/* VS Middle */}
        <div className="flex flex-col items-center justify-center gap-3">
          <div className={`text-4xl font-black ${darkMode ? 'text-gray-600' : 'text-gray-300'}`}>VS</div>
          <div className={`w-full rounded-xl p-4 text-center ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
            <p className={`text-xs font-semibold mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {comparison.temp_difference}°C apart
            </p>
            <div className="flex flex-col gap-3">
              <div>
                <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Hotter 🌡️</p>
                <p className="text-sm font-bold text-red-400">{comparison.hotter}</p>
              </div>
              <div>
                <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>More Humid 💧</p>
                <p className="text-sm font-bold text-blue-400">{comparison.more_humid}</p>
              </div>
              <div>
                <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Windier 💨</p>
                <p className="text-sm font-bold text-green-400">{comparison.windier}</p>
              </div>
            </div>
          </div>
        </div>

        {/* City 2 */}
        <div className={`rounded-xl p-4 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
          <div className="text-center mb-3">
            <p className={`text-base font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{city2.city}</p>
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{city2.country}</p>
          </div>
          <div className="text-center mb-4">
            <p className="text-3xl mb-1">{getTempEmoji(city2.temperature)}</p>
            <p className={`text-4xl font-bold ${getTempColor(city2.temperature)}`}>{city2.temperature}°C</p>
          </div>
          <StatRow icon="🌡️" label="Feels like" value={`${city2.feels_like}°C`} darkMode={darkMode} />
          <StatRow icon="💧" label="Humidity" value={`${city2.humidity}%`} darkMode={darkMode} />
          <StatRow icon="💨" label="Wind" value={`${city2.wind_speed} km/h`} darkMode={darkMode} />
        </div>

      </div>
    </div>
  )
}

export default CompareCard