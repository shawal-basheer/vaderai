function CompareCard({ darkMode, compareData }) {
  if (!compareData) return null

  const { city1, city2, comparison } = compareData

  return (
    <div className={`rounded-2xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-md'}`}>
      
      {/* Header */}
      <h3 className={`font-semibold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        🔄 City Comparison
      </h3>

      {/* Cities side by side */}
      <div className="grid grid-cols-3 gap-4 items-center">
        
        {/* City 1 */}
        <div className={`rounded-xl p-4 text-center ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {city1.city}
          </p>
          <p className={`text-xs mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {city1.country}
          </p>
          <p className="text-3xl font-bold text-blue-400">{city1.temperature}°C</p>
          <div className="mt-3 flex flex-col gap-1">
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              💧 {city1.humidity}%
            </p>
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              💨 {city1.wind_speed} km/h
            </p>
          </div>
        </div>

        {/* VS */}
        <div className="text-center">
          <p className={`text-2xl font-bold ${darkMode ? 'text-gray-400' : 'text-gray-300'}`}>
            VS
          </p>
          <p className={`text-xs mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            {comparison.temp_difference}°C difference
          </p>
        </div>

        {/* City 2 */}
        <div className={`rounded-xl p-4 text-center ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {city2.city}
          </p>
          <p className={`text-xs mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {city2.country}
          </p>
          <p className="text-3xl font-bold text-blue-400">{city2.temperature}°C</p>
          <div className="mt-3 flex flex-col gap-1">
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              💧 {city2.humidity}%
            </p>
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              💨 {city2.wind_speed} km/h
            </p>
          </div>
        </div>

      </div>

      {/* Winner row */}
      <div className={`mt-4 rounded-xl p-3 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Hotter</p>
            <p className="text-sm font-semibold text-red-400">🌡️ {comparison.hotter}</p>
          </div>
          <div>
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>More Humid</p>
            <p className="text-sm font-semibold text-blue-400">💧 {comparison.more_humid}</p>
          </div>
          <div>
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Windier</p>
            <p className="text-sm font-semibold text-green-400">💨 {comparison.windier}</p>
          </div>
        </div>
      </div>

    </div>
  )
}

export default CompareCard