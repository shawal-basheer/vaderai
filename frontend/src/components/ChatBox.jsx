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

  // First try capitalized words (proper nouns)
  const originalWords = text.replace(/[?!.,]/g, '').split(' ')
  const properNouns = originalWords.filter(w =>
    w.length > 2 &&
    w[0] === w[0].toUpperCase() &&
    w[0] !== w[0].toLowerCase() &&
    !stopWords.includes(w.toLowerCase()) &&
    !['I', 'A'].includes(w)
  )
  if (properNouns.length > 0) {
    return properNouns[properNouns.length - 1]
  }

  // Then try all words after removing stop words
  // The city is usually the most meaningful non-stop word
  const cleanWords = text.toLowerCase()
    .replace(/[?!.,]/g, '')
    .split(' ')
    .filter(w => w.length > 2 && !stopWords.includes(w))

  if (cleanWords.length === 0) return null

  // Return first meaningful word — usually the location comes early
  // e.g. "sweden weather change" → sweden is first
  // e.g. "weather change in sweden" → sweden is last
  // Try to find a word that is NOT a climate/weather word
  const weatherWords = [
    'climate', 'weather', 'temperature', 'warming', 'cooling', 'rain',
    'snow', 'wind', 'humidity', 'forecast', 'storm', 'drought', 'flood'
  ]
  
  const locationWords = cleanWords.filter(w => !weatherWords.includes(w))
  
  if (locationWords.length > 0) {
    const city = locationWords[0]
    return city.charAt(0).toUpperCase() + city.slice(1)
  }

  const city = cleanWords[0]
  return city.charAt(0).toUpperCase() + city.slice(1)
}

  const extractStartYear = (text) => {
    const currentYear = new Date().getFullYear()
    let startYear = 1970

    const yearMatch = text.match(/(\d+)\s*years?/i)
    if (yearMatch) {
      startYear = currentYear - parseInt(yearMatch[1])
    }

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
      const response = await axios.post('http://127.0.0.1:8000/chat', {
        message: userMessage
      })

      const { response: aiText, action, data } = response.data

      setMessages(prev => [...prev, { role: 'ai', text: aiText }])

      // Handle AI driven actions
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

      // Smart fallback for climate intent
      if (action === 'none' && hasClimateIntent(userMessage)) {
        const city = (data && data !== 'none') ? data : extractCity(userMessage)
        if (city && city.length > 2) {
          const startYear = extractStartYear(userMessage)
          onClimate(city, startYear)
        }
      }

    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'ai',
        text: 'Sorry, something went wrong. Please try again!'
      }])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') sendMessage()
  }

  const speak = (text) => {
    window.speechSynthesis.cancel()
    const cleanText = text
      .replace(/[🌤️🌡️💨💧🌍✈️⚠️🔊]/g, '')
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/#{1,6}/g, '')
      .trim()

    const utterance = new SpeechSynthesisUtterance(cleanText)
    utterance.lang = 'en-US'
    utterance.rate = 0.9
    utterance.pitch = 1.0
    utterance.volume = 1.0

    const voices = window.speechSynthesis.getVoices()
    const preferred = voices.find(v =>
      v.name.includes('Google') ||
      v.name.includes('Natural') ||
      v.name.includes('Samantha') ||
      v.name.includes('Karen')
    )
    if (preferred) utterance.voice = preferred
    window.speechSynthesis.speak(utterance)
  }

  return (
    <div className={`rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white shadow-md'}`}>

      <div className={`px-6 py-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Ask VäderAI
        </h3>
        <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Ask anything about weather worldwide
        </p>
      </div>

      <div className="flex gap-2 px-6 pt-4 flex-wrap">
        {[
          'Weather in Tokyo?',
          'Compare Dubai vs Delhi',
          'Best time to visit Iceland?',
          'Climate change in London?'
        ].map((hint, i) => (
          <button
            key={i}
            onClick={() => setInput(hint)}
            className={`text-xs px-3 py-1 rounded-full border transition-all
              ${darkMode
                ? 'border-gray-600 text-gray-400 hover:border-blue-400 hover:text-blue-400'
                : 'border-gray-300 text-gray-500 hover:border-blue-500 hover:text-blue-500'
              }`}
          >
            {hint}
          </button>
        ))}
      </div>

      <div className="px-6 py-4 h-64 overflow-y-auto flex flex-col gap-3">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>

            {msg.role === 'ai' && (
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                AI
              </div>
            )}

            <div className="flex flex-col gap-1 max-w-xs lg:max-w-md">
              <div className={`px-4 py-2 rounded-2xl text-sm
                ${msg.role === 'user'
                  ? 'bg-blue-500 text-white'
                  : darkMode ? 'bg-gray-700 text-gray-100' : 'bg-gray-100 text-gray-800'
                }`}>
                {msg.text}
              </div>

              {msg.role === 'ai' && (
                <button
                  onClick={() => speak(msg.text)}
                  className="text-xs text-green-400 hover:text-green-300 text-left pl-1"
                >
                  🔊 Speak
                </button>
              )}
            </div>

            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                SB
              </div>
            )}

          </div>
        ))}

        {loading && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">
              AI
            </div>
            <div className={`px-4 py-2 rounded-2xl text-sm ${darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
              Thinking...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className={`px-6 py-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask anything about weather..."
            className={`flex-1 px-4 py-2 rounded-full text-sm outline-none transition-all
              ${darkMode
                ? 'bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:border-blue-400'
                : 'bg-gray-100 text-gray-900 placeholder-gray-400 border border-gray-200 focus:border-blue-500'
              }`}
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 text-white rounded-full text-sm font-medium transition-all"
          >
            Send
          </button>
        </div>
      </div>

    </div>
  )
}

export default ChatBox