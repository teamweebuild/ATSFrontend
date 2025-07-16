// import React, { useState } from 'react'
// import {
//   Car, Eye, Settings, Gauge, Shield, Zap, Play
// } from 'lucide-react'

// const FunctionalTest = () => {
//   const functionalTests = [
//     { id: 'emission', name: 'Emission Test', description: 'Measure vehicle emission levels', icon: Zap },
//     { id: 'horn', name: 'Horn Test', description: 'Test horn sound levels', icon: Settings },
//     { id: 'exhaust-noise', name: 'Exhaust Noise Test', description: 'Measure exhaust noise levels', icon: Gauge },
//     { id: 'speedometer', name: 'Speedometer Test', description: 'Calibrate speedometer accuracy', icon: Gauge },
//     { id: 'speed-governor', name: 'Speed Governor Test', description: 'Test speed limiting system', icon: Shield },
//     { id: 'side-slip', name: 'Side Slip Test', description: 'Measure wheel alignment', icon: Settings },
//     { id: 'front-suspension', name: 'Front Suspension Test', description: 'Test front suspension system', icon: Car },
//     { id: 'rear-suspension', name: 'Rear Suspension Test', description: 'Test rear suspension system', icon: Car },
//     { id: 'service-brake', name: 'Service Brake Test', description: 'Test service brake efficiency', icon: Shield },
//     { id: 'parking-brake', name: 'Parking Brake Test', description: 'Test parking brake efficiency', icon: Shield },
//     { id: 'under-body', name: 'Under Body Visual Inspection', description: 'Visual inspection using axle play detector', icon: Eye },
//     { id: 'steering-angle', name: 'Steering Angle Test', description: 'Test steering system angles', icon: Settings },
//     { id: 'headlamp', name: 'Headlamp Test', description: 'Test headlamp alignment and intensity', icon: Eye },
//   ]
//   const [completed,setcompleted]=useState("");
// const handleClick=()=>{
       
// }
//   return (
//     <div className="p-6">
//       <h2 className="text-2xl font-bold mb-6">Functional Tests</h2>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {functionalTests.map((test) => {
//           const Icon = test.icon
//           return (
//             <div
//               key={test.id}
//               className="flex flex-col items-center bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition"
//             >
//               <div className="p-4 bg-blue-100 rounded-full mb-4">
//                 <Icon className="w-8 h-8 text-blue-600" />
//               </div>
//               <div className="text-center mb-4">
//                 <h3 className="font-semibold text-lg">{test.name}</h3>
//                 <p className="text-gray-500 text-sm">{test.description}</p>
//               </div>
//               <button
//                 className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition" onClick={handleClick}
//               >
//                 <Play className="w-4 h-4" /> Start Test
//               </button>
//             </div>
//           )
//         })}
//       </div>
//     </div>
//   )
// }

// export default FunctionalTest
import React, { useState, useEffect } from 'react'
import {
  Car, Eye, Settings, Gauge, Shield, Zap, Play, ArrowLeft, CheckCircle
} from 'lucide-react'

const functionalTests = [
  { id: 'emission', name: 'Emission Test', description: 'Measure vehicle emission levels', icon: Zap, maxValue: 100, acceptableRange: [30, 70], unit: 'ppm' },
  { id: 'horn', name: 'Horn Test', description: 'Test horn sound levels', icon: Settings, maxValue: 120, acceptableRange: [60, 80], unit: 'dB' },
  // ... add more tests as needed
]

const FunctionalTest = () => {
  const [currentView, setCurrentView] = useState('functional-test') // or 'test-selection' if you use a selection screen
  const [currentTest, setCurrentTest] = useState(null)
  const [testStatus, setTestStatus] = useState('ready') // ready | running | completed
  const [testDuration, setTestDuration] = useState(0)
  const [liveReading, setLiveReading] = useState(0)
  const [progressValue, setProgressValue] = useState(0)
  const [showProgressAfterDelay, setShowProgressAfterDelay] = useState(false)
  const [testResults, setTestResults] = useState({})

  // ✅ Timer Effect
  useEffect(() => {
    let interval = null
    if (testStatus === 'running') {
      interval = setInterval(() => {
        setTestDuration(prev => prev + 1)

        if (testDuration >= 2 && !showProgressAfterDelay) {
          setShowProgressAfterDelay(true)
        }

        if (currentTest && showProgressAfterDelay) {
          const randomValue = Math.random() * currentTest.maxValue
          setLiveReading(randomValue)
          setProgressValue(Math.min((testDuration - 2) * 10, 100))

          if (testDuration >= 12) {
            handleCompleteTest()
          }
        }
      }, 1000)
    } else {
      clearInterval(interval)
    }
    return () => clearInterval(interval)
  }, [testStatus, testDuration, showProgressAfterDelay, currentTest])

  const startTest = (test) => {
    setCurrentTest(test)
    setCurrentView('test-execution')
    setTestStatus('ready')
    setTestDuration(0)
    setLiveReading(0)
    setProgressValue(0)
    setShowProgressAfterDelay(false)
  }

  const handleStartTest = () => {
    setTestStatus('running')
  }

  const handleCompleteTest = () => {
    setTestStatus('completed')

    const result = {
      value: liveReading,
      passed: liveReading >= currentTest.acceptableRange[0] && liveReading <= currentTest.acceptableRange[1],
      duration: testDuration
    }

    setTestResults(prev => ({
      ...prev,
      [currentTest.id]: result
    }))

    setCurrentView('test-results')
  }

  const handleRetryTest = () => {
    setTestDuration(0)
    setLiveReading(0)
    setTestStatus('ready')
    setProgressValue(0)
    setShowProgressAfterDelay(false)
    setCurrentView('test-execution')
  }

  const handleSubmitTest = () => {
    setCurrentTest(null)
    setCurrentView('functional-test')
  }

  // ✅ Render Functional Test list
  if (currentView === 'functional-test') {
    return (
      <div className="space-y-6 p-6">
        <h2 className="text-2xl font-bold mb-4">Functional Tests</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {functionalTests.map((test) => {
            const Icon = test.icon
            const result = testResults[test.id]
            const isCompleted = !!result

            return (
              <div key={test.id} className="bg-white rounded-lg shadow-sm border p-4">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-blue-100 rounded-full mr-3">
                    <Icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">{test.name}</h3>
                    <p className="text-sm text-gray-500">{test.description}</p>
                  </div>
                  {isCompleted && (
                    <CheckCircle className={`h-5 w-5 ml-auto ${result.passed ? 'text-green-500' : 'text-red-500'}`} />
                  )}
                </div>

                {isCompleted ? (
                  <div className="p-2 text-sm bg-gray-50 rounded">
                    Result: {result.value.toFixed(2)} {test.unit} — {result.passed ? 'Passed' : 'Failed'}
                    <div className="mt-2 flex gap-2">
                      <button onClick={() => startTest(test)} className="px-3 py-1 text-xs bg-gray-200 rounded">Retry</button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => startTest(test)} className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                    <Play className="h-4 w-4 mr-2" /> Start Test
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // ✅ Render Test Execution
  if (currentView === 'test-execution' && currentTest) {
    return (
      <div className="p-6 space-y-6">
        <button onClick={() => setCurrentView('functional-test')} className="flex items-center text-gray-600 mb-4">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </button>

        <h2 className="text-xl font-bold">{currentTest.name}</h2>
        <p className="text-gray-600">{currentTest.description}</p>

        <div className="border p-4 rounded bg-white shadow-sm">
          <div className="mb-2">Progress: {progressValue}%</div>
          <div className="flex justify-between">
            <span>Max Value: {currentTest.maxValue} {currentTest.unit}</span>
            <span>Reading: {showProgressAfterDelay ? liveReading.toFixed(2) : '0.00'} {currentTest.unit}</span>
          </div>
          <div>Status: {testStatus}</div>

          {testStatus === 'ready' && (
            <button onClick={handleStartTest} className="mt-4 px-4 py-2 bg-green-600 text-white rounded">
              Start Test
            </button>
          )}
        </div>
      </div>
    )
  }

  // ✅ Render Test Results
  if (currentView === 'test-results' && currentTest) {
    const result = testResults[currentTest.id]
    return (
      <div className="p-6 space-y-6">
        <h2 className="text-xl font-bold">{currentTest.name} Result</h2>
        <div>Reading: {result.value.toFixed(2)} {currentTest.unit}</div>
        <div>Status: {result.passed ? 'Passed ✅' : 'Failed ❌'}</div>

        <div className="flex gap-4">
          <button onClick={handleRetryTest} className="px-4 py-2 bg-gray-200 rounded">Retry</button>
          <button onClick={handleSubmitTest} className="px-4 py-2 bg-green-600 text-white rounded">Submit</button>
        </div>
      </div>
    )
  }

  return null
}

export default FunctionalTest
