import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

const getMonthColor = (temp) => {
  if (temp >= 30) return '#ef4444'
  if (temp >= 22) return '#f97316'
  if (temp >= 15) return '#eab308'
  if (temp >= 8) return '#22c55e'
  if (temp >= 0) return '#3b82f6'
  return '#6366f1'
}

const CustomTooltip = ({ active, payload, label, darkMode }) => {
  if (active && payload && payload.length) {
    return (
      <div className={`px-3 py-2 rounded-lg text-xs border ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'}`}>
        <p className="font-semibold">{label}</p>
        <p style={{ color: getMonthColor(payload[0].value) }}>{payload[0].value}°C avg</p>
      </div>
    )
  }
  return null
}

function TravelCard({ darkMode, travelData }) {
  if (!travelData || !travelData.monthly_averages || travelData.monthly_averages.length === 0) return null

  const bestMonthIndex = travelData.monthly_averages.findIndex(m => m.month === travelData.best_month)

  return (
    <div className={`rounded-xl p-4 ${darkMode ? 'bg-gray-900' : 'bg-white shadow-md'}`}>

      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            ✈️ Travel Advisor
          </h3>
          <p className={`text-xs mt-0.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {travelData.city}, {travelData.country} — Monthly temperature breakdown
          </p>
        </div>
        {travelData.best_month && (
          <div className="bg-green-500 bg-opacity-10 border border-green-500 rounded-lg px-3 py-1.5 text-center flex-shrink-0">
            <p className="text-xs text-green-400">Best month</p>
            <p className="text-sm font-bold text-green-400">{travelData.best_month}</p>
          </div>
        )}
      </div>

      {/* Chart + Monthly grid side by side */}
      <div className="grid grid-cols-3 gap-4">

        {/* Bar chart — takes 2/3 width */}
        <div className="col-span-2">
          <p className={`text-xs mb-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            Average temperature by month
          </p>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart
              data={travelData.monthly_averages}
              margin={{ top: 5, right: 5, left: -25, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={darkMode ? '#1f2937' : '#e5e7eb'}
                vertical={false}
              />
              <XAxis
                dataKey="month"
                tick={{ fill: darkMode ? '#6b7280' : '#9ca3af', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: darkMode ? '#6b7280' : '#9ca3af', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip darkMode={darkMode} />} />
              <Bar dataKey="avg_temp" radius={[4, 4, 0, 0]} maxBarSize={30}>
                {travelData.monthly_averages.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={getMonthColor(entry.avg_temp)}
                    opacity={index === bestMonthIndex ? 1 : 0.7}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly grid — takes 1/3 width */}
        <div>
          <p className={`text-xs mb-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            Monthly averages
          </p>
          <div className="grid grid-cols-2 gap-1.5">
            {travelData.monthly_averages.map((m, i) => (
              <div
                key={i}
                className={`rounded-lg px-2 py-1.5 flex justify-between items-center
                  ${i === bestMonthIndex
                    ? 'bg-green-500 bg-opacity-20 border border-green-600'
                    : darkMode ? 'bg-gray-800' : 'bg-gray-50'
                  }`}
              >
                <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {m.month}
                </span>
                <span
                  className="text-xs font-bold"
                  style={{ color: getMonthColor(m.avg_temp) }}
                >
                  {m.avg_temp}°
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  )
}

export default TravelCard