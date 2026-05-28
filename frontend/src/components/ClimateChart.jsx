function ClimateChart({ darkMode, climateData }) {
  if (!climateData || !climateData.image) return null

  const changeColor = climateData.temp_change > 0 ? 'text-red-400' : 'text-blue-400'
  const changeText = climateData.temp_change > 0
    ? `+${climateData.temp_change}°C warmer`
    : `${climateData.temp_change}°C cooler`

  const parseExplanation = (text) => {
    if (!text) return null
    const sections = {}
    const lines = text.split('\n')
    lines.forEach(line => {
      if (line.startsWith('OVERALL:')) sections.overall = line.replace('OVERALL:', '').trim()
      if (line.startsWith('WINTERS:')) sections.winters = line.replace('WINTERS:', '').trim()
      if (line.startsWith('SUMMERS:')) sections.summers = line.replace('SUMMERS:', '').trim()
      if (line.startsWith('TREND:')) sections.trend = line.replace('TREND:', '').trim()
    })
    return sections
  }

  const sections = parseExplanation(climateData.explanation)

  return (
    <div className={`rounded-2xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-md'}`}>

      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            🌡️ Historical Climate
          </h3>
          <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {climateData.city}, {climateData.country} since {climateData.start_year}
          </p>
        </div>
        <div className={`rounded-xl px-3 py-2 text-center border ${
          climateData.temp_change > 0
            ? 'bg-red-900 bg-opacity-20 border-red-500'
            : 'bg-blue-900 bg-opacity-20 border-blue-500'
        }`}>
          <p className={`text-xs ${changeColor}`}>Since {climateData.start_year}</p>
          <p className={`text-lg font-bold ${changeColor}`}>{changeText}</p>
        </div>
      </div>

      {sections && (
        <div className="grid grid-cols-2 gap-3 mb-4">
          {sections.overall && (
            <div className={`col-span-2 rounded-xl p-3 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <p className="text-xs text-blue-400 font-semibold mb-1">🌍 Overall</p>
              <p className={`text-sm ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{sections.overall}</p>
            </div>
          )}
          {sections.winters && (
            <div className={`rounded-xl p-3 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <p className="text-xs text-blue-400 font-semibold mb-1">❄️ Winters</p>
              <p className={`text-sm ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{sections.winters}</p>
            </div>
          )}
          {sections.summers && (
            <div className={`rounded-xl p-3 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <p className="text-xs text-red-400 font-semibold mb-1">☀️ Summers</p>
              <p className={`text-sm ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{sections.summers}</p>
            </div>
          )}
          {sections.trend && (
            <div className={`col-span-2 rounded-xl p-3 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <p className="text-xs text-green-400 font-semibold mb-1">📈 Trend</p>
              <p className={`text-sm ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{sections.trend}</p>
            </div>
          )}
        </div>
      )}

      <img
        src={`data:image/png;base64,${climateData.image}`}
        alt={`Historical climate chart for ${climateData.city}`}
        className="w-full rounded-xl"
      />

    </div>
  )
}

export default ClimateChart