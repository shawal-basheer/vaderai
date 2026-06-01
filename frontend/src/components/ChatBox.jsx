import API_URL from '../config'
import { useState, useRef, useEffect } from 'react'
import axios from 'axios'

function ChatBox({ darkMode, onWeatherUpdate, onCompare, onTravel, onClimate }) {
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      text: 'Hi! I am VäderAI 🌤️ Ask me anything about weather anywhere in the world!'
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const CLIMATE_KEYWORDS = [
    'climate', 'historical', 'history', 'warming', 'warmer', 'hotter', 'cooler',
    'colder', 'temperature change', 'changed', 'over the years', 'over years',
    'past years', 'last years', 'decades', 'since 19', 'since 20', '50 years',
    '40 years', '30 years', '20 years', '10 years', 'long term', 'trend',
    'getting hotter', 'getting warmer', 'getting colder', 'used to be',
    'years ago', 'historically', 'rise in temperature', 'temperature rise',
    'global warming', 'climate change', 'how hot was', 'how cold was',
    'temperature history', 'weather history', 'past temperature', 'old weather'
  ]

  const hasClimateIntent = (text) => {
    const lower = text.toLowerCase()
    return CLIMATE_KEYWORDS.some(k => lower.includes(k))
  }

  const extractCity = (text) => {
    const stopWords = [
      'what', 'how', 'when', 'where', 'why', 'is', 'was', 'were', 'has', 'have',
      'been', 'the', 'a', 'an', 'in', 'of', 'for', 'to', 'and', 'or', 'but',
      'climate', 'change', 'weather', 'temperature', 'historical', 'history',
      'warming', 'warmer', 'hotter', 'cooler', 'colder', 'past', 'last', 'over',
      'years', 'year', 'decades', 'since', 'ago', 'long', 'term', 'trend',
      'getting', 'used', 'be', 'hot', 'cold', 'tell', 'me', 'about', 'give',
      'show', 'can', 'you', 'please', 'whats', 'old', 'rise', 'global', 'like',
      'just', 'really', 'very', 'much', 'more', 'less', 'any', 'some', 'that',
      'this', 'it', 'its', 'than', 'then', 'there', '10', '20', '30', '40',
      '50', '60', '70', '80', '90', '100', 'changing', 'changes', 'changed',
      'increase', 'decrease', 'risen', 'dropped', 'difference', 'affect',
      'impact', 'situation', 'condition', 'faced', 'face', 'seen', 'see',
      'did', 'does', 'will', 'would', 'could', 'should', 'might', 'may',
      'which', 'who', 'whose', 'whom', 'with', 'from', 'by', 'at', 'on',
      'up', 'down', 'out', 'off', 'into', 'onto', 'upon', 'after', 'before',
      'during', 'while', 'because', 'although', 'though', 'however', 'also',
      'too', 'so', 'yet', 'still', 'already', 'now', 'then', 'here', 'there',
      'today', 'yesterday', 'tomorrow', 'always', 'never', 'often', 'usually'
    ]

    const originalWords = text.replace(/[?!.,]/g, '').split(' ')
    const properNouns = originalWords.filter(w =>
      w.length > 2 &&
      w[0] === w[0].toUpperCase() &&
      w[0] !== w[0].toLowerCase() &&
      !stopWords.includes(w.toLowerCase()) &&
      !['I', 'A'].includes(w)
    )
    if (properNouns.length > 0) return properNouns[properNouns.length - 1]

    const weatherWords = ['climate', 'weather', 'temperature', 'warming', 'cooling', 'rain', 'snow', 'wind', 'humidity', 'forecast', 'storm', 'drought', 'flood']
    const cleanWords = text.toLowerCase().replace(/[?!.,]/g, '').split(' ').filter(w => w.length > 2 && !stopWords.includes(w))
    const locationWords = cleanWords.filter(w => !weatherWords.includes(w))

    if (locationWords.length > 0) {
      const city = locationWords[0]
      return city.charAt(0).toUpperCase() + city.slice(1)
    }
    if (cleanWords.length === 0) return null
    const city = cleanWords[0]
    return city.charAt(0).toUpperCase() + city.slice(1)
  }

  const extractStartYear = (text) => {
    const currentYear = new Date().getFullYear()
    let startYear = 1970
    const yearMatch = text.match(/(\d+)\s*years?/i)
    if (yearMatch) startYear = currentYear - parseInt(yearMatch[1])
    if (text.includes('50 year')) startYear = currentYear - 50
    else if (text.includes('40 year')) startYear = currentYear - 40
    else if (text.includes('30 year')) startYear = currentYear - 30
    else if (text.includes('20 year')) startYear = currentYear - 20
    else if (text.includes('10 year')) startYear = currentYear - 10
    return Math.max(startYear, 1940)
  }

  const sendMessage = async () => {
    if (!input.trim() || loading) return
    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', text: userMessage }])
    setLoading(true)

    try {
      const response = await axios.post(`${API_URL}/chat`, { message: userMessage })
      const { response: aiText, action, data } = response.data
      setMessages(prev => [...prev, { role: 'ai', text: aiText }])

      if (action === 'show_weather' && data !== 'none') {
        onWeatherUpdate(data)
      } else if (action === 'show_compare' && data !== 'none') {
        const [city1, city2] = data.split(',')
        onCompare(city1.trim(), city2.trim())
      } else if (action === 'show_travel' && data !== 'none') {
        onTravel(data)
      } else if (action === 'show_climate' && data !== 'none') {
        const startYear = extractStartYear(userMessage)
        onClimate(data, startYear)
      }

      if (action === 'none' && hasClimateIntent(userMessage)) {
        const city = (data && data !== 'none') ? data : extractCity(userMessage)
        if (city && city.length > 2) {
          const startYear = extractStartYear(userMessage)
          onClimate(city, startYear)
        }
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', text: 'Sorry, something went wrong. Please try again!' }])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') sendMessage()
  }

  const speak = (text) => {
    window.speechSynthesis.cancel()
    const cleanText = text.replace(/[🌤️🌡️💨💧🌍✈️⚠️🔊]/g, '').replace(/\*\*/g, '').replace(/\*/g, '').replace(/#{1,6}/g, '').trim()
    const utterance = new SpeechSynthesisUtterance(cleanText)
    utterance.lang = 'en-US'
    utterance.rate = 0.9
    const voices = window.speechSynthesis.getVoices()
    const preferred = voices.find(v => v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha'))
    if (preferred) utterance.voice = preferred
    window.speechSynthesis.speak(utterance)
  }

  return (
    <div className={`rounded-xl flex flex-col h-full ${darkMode ? 'bg-gray-900' : 'bg-white shadow-md'}`}>

      {/* Header */}
      <div className={`px-4 py-3 border-b flex-shrink-0 ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
        <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Ask VäderAI
        </h3>
        <p className={`text-xs mt-0.5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
          Ask anything about weather worldwide
        </p>
      </div>

      {/* Hint pills */}
      <div className="flex gap-2 px-4 pt-3 flex-wrap flex-shrink-0">
        {['Weather in Tokyo?', 'Compare Dubai vs Delhi', 'Climate change in London?'].map((hint, i) => (
          <button
            key={i}
            onClick={() => setInput(hint)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-all
              ${darkMode
                ? 'border-gray-700 text-gray-400 hover:border-blue-400 hover:text-blue-400'
                : 'border-gray-300 text-gray-500 hover:border-blue-500 hover:text-blue-500'
              }`}
          >
            {hint}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3 min-h-0">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>

            {msg.role === 'ai' && (
              <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-1">
                AI
              </div>
            )}

            <div className="flex flex-col gap-1" style={{ maxWidth: '85%' }}>
              <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed
                ${msg.role === 'user'
                  ? 'bg-blue-500 text-white'
                  : darkMode ? 'bg-gray-800 text-gray-100' : 'bg-gray-100 text-gray-800'
                }`}>
                {msg.text}
              </div>
              {msg.role === 'ai' && (
                <button onClick={() => speak(msg.text)} className="text-xs text-green-400 hover:text-green-300 text-left pl-1">
                  🔊 Speak
                </button>
              )}
            </div>

            {msg.role === 'user' && (
              <div className="w-7 h-7 rounded-full bg-gray-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-1">
                SB
              </div>
            )}

          </div>
        ))}

        {loading && (
          <div className="flex gap-2 justify-start">
            <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">AI</div>
            <div className={`px-4 py-2.5 rounded-2xl text-sm ${darkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
              Thinking...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className={`px-4 py-3 border-t flex-shrink-0 ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask anything about weather..."
            className={`flex-1 px-4 py-2.5 rounded-full text-sm outline-none transition-all
              ${darkMode
                ? 'bg-gray-800 text-white placeholder-gray-500 border border-gray-700 focus:border-blue-400'
                : 'bg-gray-100 text-gray-900 placeholder-gray-400 border border-gray-200 focus:border-blue-500'
              }`}
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            className="px-5 py-2.5 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-700 text-white rounded-full text-sm font-medium transition-all"
          >
            Send
          </button>
        </div>
      </div>

    </div>
  )
}

export default ChatBox