import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

function TravelCard({ darkMode, travelData }) {
  if (!travelData || !travelData.monthly_averages || travelData.monthly_averages.length === 0) return null

  return (
    <div className={`rounded-2xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-md'}`}>

      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            ✈️ Travel Advisor
          </h3>
          <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {travelData.city}, {travelData.country}
          </p>
        </div>
        {travelData.best_month && (
          <div className="bg-green-500 bg-opacity-20 border border-green-500 rounded-xl px-3 py-2 text-center">
            <p className="text-xs text-green-400">Best month</p>
            <p className="text-lg font-bold text-green-400">{travelData.best_month}</p>
          </div>
        )}
      </div>

      {/* Monthly temperature chart */}
      <p className={`text-xs mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        Monthly average temperature
      </p>
      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={travelData.monthly_averages} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
          <XAxis
            dataKey="month"
            tick={{ fill: darkMode ? '#9ca3af' : '#6b7280', fontSize: 11 }}
            axisLine={{ stroke: darkMode ? '#374151' : '#e5e7eb' }}
          />
          <YAxis
            tick={{ fill: darkMode ? '#9ca3af' : '#6b7280', fontSize: 11 }}
            axisLine={{ stroke: darkMode ? '#374151' : '#e5e7eb' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: darkMode ? '#1f2937' : '#ffffff',
              border: darkMode ? '1px solid #374151' : '1px solid #e5e7eb',
              borderRadius: '8px',
              color: darkMode ? '#ffffff' : '#111827'
            }}
            formatter={(value) => [`${value}°C`, 'Avg Temp']}
          />
          <Bar dataKey="avg_temp" name="Avg Temp" fill="#10b981" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>

      {/* Monthly grid */}
      <div className="grid grid-cols-6 gap-2 mt-4">
        {travelData.monthly_averages.map((m, i) => (
          <div
            key={i}
            className={`rounded-lg p-2 text-center ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}
          >
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{m.month}</p>
            <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {m.avg_temp}°
            </p>
          </div>
        ))}
      </div>

    </div>
  )
}

export default TravelCard