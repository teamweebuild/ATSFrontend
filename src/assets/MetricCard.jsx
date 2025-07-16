import React from 'react'

const MetricCard = ({ title, value, icon: Icon, color = 'blue' }) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    red: 'bg-red-100 text-red-600'
  }

  return (
    <div className="p-4 bg-white rounded-xl shadow flex items-center space-x-4">
      <div className={`p-3 rounded-full ${colorClasses[color]} flex items-center justify-center`}>
        <img src={Icon} alt="" className="h-6 w-6" />
      </div>
      <div>
        <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
        <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
      </div>
    </div>
  )
}

export default MetricCard
