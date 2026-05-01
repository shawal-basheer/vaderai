import { useState, useEffect } from 'react'
import axios from 'axios'
import Navbar from './components/Navbar'
import WeatherCard from './components/WeatherCard'
import ForecastChart from './components/ForecastChart'
import AlertBanner from './components/AlertBanner'
import CompareCard from './components/CompareCard'
import TravelCard from './components/TravelCard'
import ChatBox from './components/ChatBox'

function App() {
  const [darkMode, setDarkMode] = useState(true)
  const [weather, setWeather] = useState(null)
  const [forecast, setForecast] = useState([])
  const [alerts, setAlerts] = useState([])
  const [compareData, setCompareData] = useState(null)
  const [travelData, setTravelData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [locationStatus, setLocationStatus] = useState('Detecting your location...')

  useEffect(() => {
    detectLocation()
  }, [])

  const detectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords
          try {
            const response = await axios.get(`http://127.0.0.1:8000/location?lat=${latitude}&lon=${longitude}`)
            const city = response.data.city
            setLocationStatus(`📍 ${city}`)
            fetchWeather(city)
          } catch (error) {
            setLocationStatus('📍 Sundsvall')
            fetchWeather('Sundsvall')
          }
        },
        () => {
          setLocationStatus('📍 Sundsvall')
          fetchWeather('Sundsvall')
        }
      )
    } else {
      setLocationStatus('📍 Sundsvall')
      fetchWeather('Sundsvall')
    }
  }

  const fetchWeather = async (city) => {
    setLoading(true)
    setCompareData(null)
    setTravelData(null)
    try {
      const [weatherRes, forecastRes, alertsRes] = await Promise.all([
        axios.get(`http://127.0.0.1:8000/weather/${city}`),
        axios.get(`http://127.0.0.1:8000/forecast/${city}`),
        axios.get(`http://127.0.0.1:8000/alerts/${city}`)
      ])
      setWeather(weatherRes.data)
      setForecast(forecastRes.data.forecast)
      setAlerts(alertsRes.data.alerts)
    } catch (error) {
      console.error('Error fetching weather:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchComparison = async (city1, city2) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/compare?city1=${city1}&city2=${city2}`)
      setCompareData(response.data)
      setTravelData(null)
    } catch (error) {
      console.error('Error fetching comparison:', error)
    }
  }

  const fetchTravel = async (city) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/travel/${city}`)
      setTravelData(response.data)
      setCompareData(null)
    } catch (error) {
      console.error('Error fetching travel data:', error)
    }
  }

  return (
    <div className={darkMode ? 'bg-gray-900 min-h-screen' : 'bg-gray-100 min-h-screen'}>
      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        locationStatus={locationStatus}
      />
      <div className="p-6 max-w-4xl mx-auto flex flex-col gap-6">
        <AlertBanner darkMode={darkMode} alerts={alerts} />
        <WeatherCard darkMode={darkMode} weather={weather} loading={loading} />
        <ForecastChart darkMode={darkMode} forecast={forecast} />
        {compareData && <CompareCard darkMode={darkMode} compareData={compareData} />}
        {travelData && <TravelCard darkMode={darkMode} travelData={travelData} />}
        <ChatBox
          darkMode={darkMode}
          onWeatherUpdate={fetchWeather}
          onCompare={fetchComparison}
          onTravel={fetchTravel}
        />
      </div>
    </div>
  )
}

export default App