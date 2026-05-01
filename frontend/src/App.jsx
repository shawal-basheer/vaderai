import { useState, useEffect } from 'react'
import axios from 'axios'
import Navbar from './components/Navbar'
import WeatherCard from './components/WeatherCard'
import ForecastChart from './components/ForecastChart'
import ChatBox from './components/ChatBox'

function App() {
  const [darkMode, setDarkMode] = useState(true)
  const [weather, setWeather] = useState(null)
  const [forecast, setForecast] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchWeather('Sundsvall')
  }, [])

  const fetchWeather = async (city) => {
    setLoading(true)
    try {
      const [weatherRes, forecastRes] = await Promise.all([
        axios.get(`http://127.0.0.1:8000/weather/${city}`),
        axios.get(`http://127.0.0.1:8000/forecast/${city}`)
      ])
      setWeather(weatherRes.data)
      setForecast(forecastRes.data.forecast)
    } catch (error) {
      console.error('Error fetching weather:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={darkMode ? 'bg-gray-900 min-h-screen' : 'bg-gray-100 min-h-screen'}>
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
      <div className="p-6 max-w-4xl mx-auto flex flex-col gap-6">
        <WeatherCard darkMode={darkMode} weather={weather} loading={loading} />
        <ForecastChart darkMode={darkMode} forecast={forecast} />
        <ChatBox darkMode={darkMode} onWeatherUpdate={fetchWeather} />
      </div>
    </div>
  )
}

export default App