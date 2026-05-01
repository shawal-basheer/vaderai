import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

function ForecastChart({ darkMode, forecast }) {
  if (!forecast || forecast.length === 0) return null

  return (
    <div className={`rounded-2xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-md'}`}>
      
      {/* Header */}
      <h3 className={`font-semibold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        7 Day Forecast
      </h3>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={forecast} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
          
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke={darkMode ? '#374151' : '#e5e7eb'} 
          />
          
          <XAxis 
            dataKey="day" 
            tick={{ fill: darkMode ? '#9ca3af' : '#6b7280', fontSize: 12 }}
            axisLine={{ stroke: darkMode ? '#374151' : '#e5e7eb' }}
          />
          
          <YAxis 
            tick={{ fill: darkMode ? '#9ca3af' : '#6b7280', fontSize: 12 }}
            axisLine={{ stroke: darkMode ? '#374151' : '#e5e7eb' }}
          />
          
          <Tooltip
            contentStyle={{
              backgroundColor: darkMode ? '#1f2937' : '#ffffff',
              border: darkMode ? '1px solid #374151' : '1px solid #e5e7eb',
              borderRadius: '8px',
              color: darkMode ? '#ffffff' : '#111827'
            }}
            formatter={(value) => [`${value}°C`]}
          />
          
          <Legend 
            wrapperStyle={{ 
              color: darkMode ? '#9ca3af' : '#6b7280',
              fontSize: '12px'
            }}
          />
          
          <Bar dataKey="max" name="Max °C" fill="#ef4444" radius={[4, 4, 0, 0]} />
          <Bar dataKey="min" name="Min °C" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          
        </BarChart>
      </ResponsiveContainer>

    </div>
  )
}

export default ForecastChart