import { useState, useRef, useEffect } from 'react'
import axios from 'axios'

function ChatBox({ darkMode, onWeatherUpdate, onCompare, onTravel }) {
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      text: 'Hi! I am VäderAI 🌤️ Ask me anything about weather anywhere in the world!'
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  // Auto scroll to bottom when new message arrives
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

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

      // Add AI response to chat
      setMessages(prev => [...prev, { role: 'ai', text: aiText }])

      // Let the backend decide what to show on dashboard
      if (action === 'show_weather' && data !== 'none') {
        onWeatherUpdate(data)
      } else if (action === 'show_compare' && data !== 'none') {
        const [city1, city2] = data.split(',')
        onCompare(city1.trim(), city2.trim())
      } else if (action === 'show_travel' && data !== 'none') {
        onTravel(data)
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

  // Send message on Enter key
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') sendMessage()
  }

  // Text to speech
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

      {/* Chat header */}
      <div className={`px-6 py-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Ask VäderAI
        </h3>
        <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Ask anything about weather worldwide
        </p>
      </div>

      {/* Hint pills */}
      <div className="flex gap-2 px-6 pt-4 flex-wrap">
        {[
          'Weather in Tokyo?',
          'Compare Dubai vs Delhi',
          'Best time to visit Iceland?'
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

      {/* Messages */}
      <div className="px-6 py-4 h-64 overflow-y-auto flex flex-col gap-3">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>

            {/* AI avatar */}
            {msg.role === 'ai' && (
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                AI
              </div>
            )}

            <div className="flex flex-col gap-1 max-w-xs lg:max-w-md">
              {/* Message bubble */}
              <div className={`px-4 py-2 rounded-2xl text-sm
                ${msg.role === 'user'
                  ? 'bg-blue-500 text-white'
                  : darkMode ? 'bg-gray-700 text-gray-100' : 'bg-gray-100 text-gray-800'
                }`}>
                {msg.text}
              </div>

              {/* Speak button for AI messages */}
              {msg.role === 'ai' && (
                <button
                  onClick={() => speak(msg.text)}
                  className="text-xs text-green-400 hover:text-green-300 text-left pl-1"
                >
                  🔊 Speak
                </button>
              )}
            </div>

            {/* User avatar */}
            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                SB
              </div>
            )}

          </div>
        ))}

        {/* Loading indicator */}
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

      {/* Input area */}
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