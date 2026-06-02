import API_URL from './config'
import { useState, useEffect } from 'react'
import axios from 'axios'
import Navbar from './components/Navbar'
import WeatherCard from './components/WeatherCard'
import ForecastChart from './components/ForecastChart'
import AlertBanner from './components/AlertBanner'
import CompareCard from './components/CompareCard'
import TravelCard from './components/TravelCard'
import ClimateChart from './components/ClimateChart'
import ChatBox from './components/ChatBox'

function App() {
  const [darkMode, setDarkMode] = useState(true)
  const [weather, setWeather] = useState(null)
  const [forecast, setForecast] = useState([])
  const [alerts, setAlerts] = useState([])
  const [compareData, setCompareData] = useState(null)
  const [travelData, setTravelData] = useState(null)
  const [climateData, setClimateData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [locationStatus, setLocationStatus] = useState('Detecting your location...')

  useEffect(() => { detectLocation() }, [])

  // Update browser tab title when weather changes
  useEffect(() => {
    if (weather?.city) {
      document.title = `${weather.city} - VäderAI`
    } else {
      document.title = "VäderAI - Weather Intelligence"
    }
  }, [weather])

  const detectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords
          try {
            const response = await axios.get(`${API_URL}/location?lat=${latitude}&lon=${longitude}`)
            const city = response.data.city
            setLocationStatus(`📍 ${city}`)
            fetchWeather(city)
          } catch {
            setLocationStatus('📍 Sundsvall')
            fetchWeather('Sundsvall')
          }
        },
        () => { setLocationStatus('📍 Sundsvall'); fetchWeather('Sundsvall') }
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
    setClimateData(null)
    try {
      const [weatherRes, forecastRes, alertsRes] = await Promise.all([
        axios.get(`${API_URL}/weather/${city}`),
        axios.get(`${API_URL}/forecast/${city}`),
        axios.get(`${API_URL}/alerts/${city}`)
      ])
      setWeather(weatherRes.data)
      setForecast(forecastRes.data.forecast)
      setAlerts(alertsRes.data.alerts)
    } catch (error) { console.error(error) }
    finally { setLoading(false) }
  }

  const fetchComparison = async (city1, city2) => {
    try {
      const response = await axios.get(`${API_URL}/compare?city1=${city1}&city2=${city2}`)
      setCompareData(response.data)
      setTravelData(null)
      setClimateData(null)
    } catch (error) { console.error(error) }
  }

  const fetchTravel = async (city) => {
    try {
      const response = await axios.get(`${API_URL}/travel/${city}`)
      setTravelData(response.data)
      setCompareData(null)
      setClimateData(null)
    } catch (error) { console.error(error) }
  }

  const fetchClimate = async (city, startYear = 1970) => {
    try {
      const response = await axios.get(`${API_URL}/climate/${city}?start_year=${startYear}`)
      setClimateData(response.data)
      setCompareData(null)
      setTravelData(null)
    } catch (error) { console.error(error) }
  }

  const hasDynamicCard = compareData || travelData || climateData

  return (
    <div className={`flex flex-col h-screen overflow-hidden ${darkMode ? 'bg-gray-950' : 'bg-gray-100'}`}>

      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} locationStatus={locationStatus} />

      {alerts.length > 0 && (
        <div className="px-3 pt-2 flex-shrink-0">
          <AlertBanner darkMode={darkMode} alerts={alerts} />
        </div>
      )}

      <div className="flex flex-1 gap-3 p-3 overflow-hidden min-h-0">

        {/* LEFT COLUMN */}
        <div className="flex flex-col gap-3 flex-shrink-0 min-h-0" style={{ width: '420px' }}>
          <div className="flex-shrink-0">
            <WeatherCard darkMode={darkMode} weather={weather} loading={loading} />
          </div>
          <div className="flex-1 min-h-0 overflow-hidden">
            <ChatBox
              darkMode={darkMode}
              onWeatherUpdate={fetchWeather}
              onCompare={fetchComparison}
              onTravel={fetchTravel}
              onClimate={fetchClimate}
            />
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="flex flex-col gap-3 flex-1 min-h-0 overflow-hidden">

          {/* Forecast — always fixed height */}
          <div className="flex-shrink-0" style={{ height: '260px' }}>
            <ForecastChart darkMode={darkMode} forecast={forecast} />
          </div>

          {/* Dynamic cards */}
          {hasDynamicCard && (
            <div className="flex-1 min-h-0 overflow-y-auto">
              {compareData && <CompareCard darkMode={darkMode} compareData={compareData} />}
              {travelData && <TravelCard darkMode={darkMode} travelData={travelData} />}
              {climateData && <ClimateChart darkMode={darkMode} climateData={climateData} />}
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

export default App