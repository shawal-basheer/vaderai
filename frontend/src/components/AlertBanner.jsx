function AlertBanner({ darkMode, alerts }) {
  if (!alerts || alerts.length === 0) return null

  const getAlertStyle = (type) => {
    switch (type) {
      case 'heat':
        return 'bg-red-900 border-red-500 text-red-200'
      case 'cold':
        return 'bg-blue-900 border-blue-500 text-blue-200'
      case 'wind':
        return 'bg-yellow-900 border-yellow-500 text-yellow-200'
      case 'humidity':
        return 'bg-purple-900 border-purple-500 text-purple-200'
      default:
        return 'bg-orange-900 border-orange-500 text-orange-200'
    }
  }

  const getAlertIcon = (type) => {
    switch (type) {
      case 'heat': return '🌡️'
      case 'cold': return '🥶'
      case 'wind': return '💨'
      case 'humidity': return '💧'
      default: return '⚠️'
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {alerts.map((alert, i) => (
        <div
          key={i}
          className={`rounded-xl px-4 py-3 border flex items-center gap-3 ${getAlertStyle(alert.type)}`}
        >
          <span className="text-xl">{getAlertIcon(alert.type)}</span>
          <div>
            <span className="text-xs font-bold uppercase tracking-wide opacity-70">
              {alert.severity} alert
            </span>
            <p className="text-sm font-medium">{alert.message}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default AlertBanner