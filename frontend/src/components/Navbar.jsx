function Navbar({ darkMode, setDarkMode, locationStatus }) {
  return (
    <nav className={`flex items-center justify-between px-5 py-3 border-b flex-shrink-0 ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
      <div className="flex items-center gap-2">
        <span className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Väder<span className="text-blue-400">AI</span>
        </span>
        <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
          Weather Intelligence
        </span>
      </div>

      <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        {locationStatus}
      </div>

      <button
        onClick={() => setDarkMode(!darkMode)}
        className={`text-sm px-3 py-1.5 rounded-full border transition-all
          ${darkMode
            ? 'border-gray-700 text-gray-400 hover:border-blue-400 hover:text-blue-400'
            : 'border-gray-300 text-gray-500 hover:border-blue-500 hover:text-blue-500'
          }`}
      >
        {darkMode ? '☀️ Light' : '🌙 Dark'}
      </button>
    </nav>
  )
}

export default Navbar