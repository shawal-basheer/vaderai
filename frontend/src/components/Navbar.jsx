function Navbar({ darkMode, setDarkMode, locationStatus }) {
  return (
    <nav className={`flex items-center justify-between px-6 py-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
      
      {/* Logo */}
      <div className="flex items-center gap-2">
        <span className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Väder<span className="text-blue-500">AI</span>
        </span>
        <span className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Weather Intelligence
        </span>
      </div>

      {/* Location status */}
      <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        {locationStatus}
      </div>

      {/* Dark/Light toggle */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm transition-all
          ${darkMode 
            ? 'border-gray-600 text-gray-300 hover:border-blue-400 hover:text-blue-400' 
            : 'border-gray-300 text-gray-600 hover:border-blue-500 hover:text-blue-500'
          }`}
      >
        {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
      </button>

    </nav>
  )
}

export default Navbar