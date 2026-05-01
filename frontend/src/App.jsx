import { useState, useEffect } from 'react'
import axios from 'axios'
import Navbar from './components/Navbar'
import WeatherCard from './components/WeatherCard'
import ChatBox from './components/ChatBox'

function App() {
  const [darkMode, setDarkMode] = useState(true)
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchWeather('Sundsvall')
  }, [])

  const fetchWeather = async (city) => {
    setLoading(true)
    try {
      const response = await axios.get(`http://127.0.0.1:8000/weather/${city}`)
      setWeather(response.data)
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
        <ChatBox darkMode={darkMode} onWeatherUpdate={fetchWeather} />
      </div>
    </div>
  )
}

export default App