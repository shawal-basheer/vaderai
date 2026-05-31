function ClimateChart({ darkMode, climateData }) {
  if (!climateData || !climateData.image) return null

  const changeColor = climateData.temp_change > 0 ? 'text-red-400' : 'text-blue-400'
  const changeText = climateData.temp_change > 0
    ? `+${climateData.temp_change}°C warmer`
    : `${climateData.temp_change}°C cooler`

  const parseExplanation = (text) => {
    if (!text) return null
    const sections = {}
    text.split('\n').forEach(line => {
      if (line.startsWith('OVERALL:')) sections.overall = line.replace('OVERALL:', '').trim()
      if (line.startsWith('WINTERS:')) sections.winters = line.replace('WINTERS:', '').trim()
      if (line.startsWith('SUMMERS:')) sections.summers = line.replace('SUMMERS:', '').trim()
      if (line.startsWith('TREND:')) sections.trend = line.replace('TREND:', '').trim()
    })
    return sections
  }

  const sections = parseExplanation(climateData.explanation)

  return (
    <div className={`rounded-xl p-4 flex flex-col gap-3 ${darkMode ? 'bg-gray-900' : 'bg-white shadow-md'}`}>

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            🌡️ Historical Climate — {climateData.city}, {climateData.country}
          </h3>
          <p className={`text-xs mt-0.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Temperature trends since {climateData.start_year}
          </p>
        </div>
        <div className={`rounded-lg px-3 py-1.5 border ${
          climateData.temp_change > 0
            ? 'bg-red-900 bg-opacity-20 border-red-800'
            : 'bg-blue-900 bg-opacity-20 border-blue-800'
        }`}>
          <p className={`text-sm font-bold ${changeColor}`}>{changeText}</p>
          <p className={`text-xs ${changeColor} opacity-70 text-center`}>since {climateData.start_year}</p>
        </div>
      </div>

      {/* Explanation grid */}
      {sections && (
        <div className="grid grid-cols-4 gap-2">
          {sections.overall && (
            <div className={`col-span-4 rounded-lg p-3 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
              <p className="text-xs text-blue-400 font-semibold mb-1">🌍 Overall</p>
              <p className={`text-xs leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{sections.overall}</p>
            </div>
          )}
          {sections.winters && (
            <div className={`col-span-2 rounded-lg p-3 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
              <p className="text-xs text-blue-400 font-semibold mb-1">❄️ Winters</p>
              <p className={`text-xs leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{sections.winters}</p>
            </div>
          )}
          {sections.summers && (
            <div className={`col-span-2 rounded-lg p-3 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
              <p className="text-xs text-red-400 font-semibold mb-1">☀️ Summers</p>
              <p className={`text-xs leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{sections.summers}</p>
            </div>
          )}
          {sections.trend && (
            <div className={`col-span-4 rounded-lg p-3 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
              <p className="text-xs text-green-400 font-semibold mb-1">📈 Trend</p>
              <p className={`text-xs leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{sections.trend}</p>
            </div>
          )}
        </div>
      )}

      {/* Chart — fills remaining space */}
      <img
        src={`data:image/png;base64,${climateData.image}`}
        alt={`Historical climate chart for ${climateData.city}`}
        className="w-full rounded-lg"
        style={{ height: '380px', objectFit: 'fill' }}
      />

    </div>
  )
}

export default ClimateChart