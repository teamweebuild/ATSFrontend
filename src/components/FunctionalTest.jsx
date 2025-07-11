import React, { useState } from 'react'
import {
  Car, Eye, Settings, Gauge, Shield, Zap, Play
} from 'lucide-react'

const FunctionalTest = () => {
  const functionalTests = [
    { id: 'emission', name: 'Emission Test', description: 'Measure vehicle emission levels', icon: Zap },
    { id: 'horn', name: 'Horn Test', description: 'Test horn sound levels', icon: Settings },
    { id: 'exhaust-noise', name: 'Exhaust Noise Test', description: 'Measure exhaust noise levels', icon: Gauge },
    { id: 'speedometer', name: 'Speedometer Test', description: 'Calibrate speedometer accuracy', icon: Gauge },
    { id: 'speed-governor', name: 'Speed Governor Test', description: 'Test speed limiting system', icon: Shield },
    { id: 'side-slip', name: 'Side Slip Test', description: 'Measure wheel alignment', icon: Settings },
    { id: 'front-suspension', name: 'Front Suspension Test', description: 'Test front suspension system', icon: Car },
    { id: 'rear-suspension', name: 'Rear Suspension Test', description: 'Test rear suspension system', icon: Car },
    { id: 'service-brake', name: 'Service Brake Test', description: 'Test service brake efficiency', icon: Shield },
    { id: 'parking-brake', name: 'Parking Brake Test', description: 'Test parking brake efficiency', icon: Shield },
    { id: 'under-body', name: 'Under Body Visual Inspection', description: 'Visual inspection using axle play detector', icon: Eye },
    { id: 'steering-angle', name: 'Steering Angle Test', description: 'Test steering system angles', icon: Settings },
    { id: 'headlamp', name: 'Headlamp Test', description: 'Test headlamp alignment and intensity', icon: Eye },
  ]
  const [completed,setcompleted]=useState("");
const handleClick=()=>{
       
}
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Functional Tests</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {functionalTests.map((test) => {
          const Icon = test.icon
          return (
            <div
              key={test.id}
              className="flex flex-col items-center bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition"
            >
              <div className="p-4 bg-blue-100 rounded-full mb-4">
                <Icon className="w-8 h-8 text-blue-600" />
              </div>
              <div className="text-center mb-4">
                <h3 className="font-semibold text-lg">{test.name}</h3>
                <p className="text-gray-500 text-sm">{test.description}</p>
              </div>
              <button
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition" onClick={handleClick}
              >
                <Play className="w-4 h-4" /> Start Test
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default FunctionalTest
