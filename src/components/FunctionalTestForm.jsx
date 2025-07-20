import React, { useState, useEffect } from 'react';
import { Play, ArrowLeft, CheckCircle, XCircle } from 'lucide-react';

const FunctionalTestForm = ({ 
  selectedRule, 
  onSubmit, 
  onCancel, 
  submitting,
  onBack 
}) => {
  const [testStatus, setTestStatus] = useState('ready'); // ready | running | completed
  const [testDuration, setTestDuration] = useState(0);
  const [liveReading, setLiveReading] = useState(0);
  const [progressValue, setProgressValue] = useState(0);
  const [showProgressAfterDelay, setShowProgressAfterDelay] = useState(false);
  const [finalResult, setFinalResult] = useState(null);
  const [serialData, setSerialData] = useState(null);
  const [lastValidReading, setLastValidReading] = useState(0);

  // Test configurations for different rules
  const testConfigs = {
    rule189_37: {
      name: 'Rule 189.37 - Acceleration Test',
      description: 'Measure vehicle acceleration performance',
      maxValue: 10,
      acceptableRange: [2, 8],
      unit: 'seconds',
      duration: 12 // seconds for acceleration test
    }
  };

  const currentTest = testConfigs[selectedRule];

  // Serial data handler effect
  useEffect(() => {
    // Function to handle serial data
    const handleSerialData = (data) => {
      console.log("Received serial data:", data);
      
      if (testStatus === 'running') {
        try {
          // Parse the serial data string
          const parsedData = parseSerialData(data);
          setSerialData(parsedData);
          
          // For acceleration test, we might use a specific field or calculate from multiple values
          // Example: using axle_play_horizontal as acceleration reading (you can modify this)
          const accelerationReading = parseFloat(parsedData.axle_play_horizontal || 0) * 10; // Scale as needed
          
          setLiveReading(accelerationReading);
          setLastValidReading(accelerationReading);
        } catch (error) {
          console.error("Error parsing serial data:", error);
        }
      }
    };

    // Set up the global serial data handler
    if (testStatus === 'running') {
      window.onSerialData = handleSerialData;
    } else {
      // Clean up when not running
      window.onSerialData = null;
    }

    // Cleanup on unmount
    return () => {
      if (window.onSerialData === handleSerialData) {
        window.onSerialData = null;
      }
    };
  }, [testStatus]);

  // Helper function to parse serial data string
  const parseSerialData = (dataString) => {
    const data = {};
    const pairs = dataString.split(',');
    
    pairs.forEach(pair => {
      const [key, value] = pair.split(':');
      if (key && value !== undefined) {
        data[key.trim()] = value.trim();
      }
    });
    
    return data;
  };

  // Timer Effect - now handles real serial data
  useEffect(() => {
    let interval = null;
    if (testStatus === 'running') {
      interval = setInterval(() => {
        setTestDuration(prev => prev + 1);

        if (testDuration >= 2 && !showProgressAfterDelay) {
          setShowProgressAfterDelay(true);
        }

        if (currentTest && showProgressAfterDelay) {
          // Update progress based on time
          setProgressValue(Math.min((testDuration - 2) * (100 / (currentTest.duration - 2)), 100));

          // Auto-complete test when duration is reached
          if (testDuration >= currentTest.duration) {
            handleCompleteTest(lastValidReading || liveReading);
          }
        }
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [testStatus, testDuration, showProgressAfterDelay, currentTest, lastValidReading, liveReading]);

  const handleStartTest = () => {
    console.log("Starting acceleration test - listening for serial data");
    setTestStatus('running');
    setSerialData(null);
    setLiveReading(0);
    setLastValidReading(0);
  };

  const handleCompleteTest = (finalValue) => {
    console.log("Completing test with final value:", finalValue);
    setTestStatus('completed');
    
    // Stop listening to serial data
    window.onSerialData = null;
    
    const passed = finalValue >= currentTest.acceptableRange[0] && 
                   finalValue <= currentTest.acceptableRange[1];
    
    const result = {
      value: finalValue,
      passed: passed,
      duration: testDuration,
      serialData: serialData // Include the last serial data received
    };
    
    setFinalResult(result);
  };

  const handleRetryTest = () => {
    setTestDuration(0);
    setLiveReading(0);
    setTestStatus('ready');
    setProgressValue(0);
    setShowProgressAfterDelay(false);
    setFinalResult(null);
    setSerialData(null);
    setLastValidReading(0);
    
    // Ensure serial data handler is cleared
    window.onSerialData = null;
  };

  const handleSubmitResult = () => {
    if (finalResult) {
      // Submit the final reading value
      onSubmit(selectedRule, finalResult.value);
    }
  };

  const handleStopTest = () => {
    console.log("Stopping test manually");
    handleCompleteTest(lastValidReading || liveReading || 0);
  };

  if (!currentTest) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-600">Invalid test rule selected</p>
        <button 
          onClick={onBack}
          className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
        >
          Back to Test Selection
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-800">{currentTest.name}</h3>
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Test Selection
        </button>
      </div>

      <p className="text-gray-600 mb-6">{currentTest.description}</p>

      {/* Test Status Display */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-sm text-gray-500">Max Value</p>
            <p className="font-semibold">{currentTest.maxValue} {currentTest.unit}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Current Reading</p>
            <p className="font-semibold">
              {showProgressAfterDelay ? liveReading.toFixed(2) : '0.00'} {currentTest.unit}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Progress</p>
            <p className="font-semibold">{progressValue.toFixed(0)}%</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Status</p>
            <p className={`font-semibold capitalize ${
              testStatus === 'ready' ? 'text-blue-600' :
              testStatus === 'running' ? 'text-yellow-600' :
              'text-green-600'
            }`}>
              {testStatus}
            </p>
          </div>
        </div>

        {/* Serial Data Status */}
        {testStatus === 'running' && (
          <div className="mt-4 p-3 bg-white rounded border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Serial Data Status</p>
                <p className="text-xs text-gray-500">
                  {serialData ? `Last reading: ${new Date().toLocaleTimeString()}` : 'Waiting for data...'}
                </p>
              </div>
              <div className={`w-3 h-3 rounded-full ${
                serialData ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'
              }`}></div>
            </div>
          </div>
        )}

        {/* Progress Bar */}
        {testStatus === 'running' && (
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Test Progress</span>
              <span>{testDuration}s / {currentTest.duration}s</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${progressValue}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Test Instructions */}
        {testStatus === 'ready' && (
          <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-200">
            <h4 className="font-medium text-blue-800 mb-2">📋 Test Instructions</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Ensure vehicle is properly positioned</li>
              <li>• Serial port connection should be active</li>
              <li>• Test will read live data from serial port</li>
              <li>• Acceptable range: {currentTest.acceptableRange[0]}-{currentTest.acceptableRange[1]} {currentTest.unit}</li>
            </ul>
          </div>
        )}
      </div>

      {/* Test Results */}
      {finalResult && (
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold">Test Results</h4>
            {finalResult.passed ? (
              <CheckCircle className="h-6 w-6 text-green-500" />
            ) : (
              <XCircle className="h-6 w-6 text-red-500" />
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Final Reading</p>
              <p className="font-semibold">{finalResult.value.toFixed(2)} {currentTest.unit}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Result</p>
              <p className={`font-semibold ${finalResult.passed ? 'text-green-600' : 'text-red-600'}`}>
                {finalResult.passed ? 'PASSED' : 'FAILED'}
              </p>
            </div>
          </div>
          <div className="mt-2">
            <p className="text-sm text-gray-500">
              Acceptable Range: {currentTest.acceptableRange[0]} - {currentTest.acceptableRange[1]} {currentTest.unit}
            </p>
          </div>
          
          {/* Serial Data Debug Info */}
          {finalResult.serialData && (
            <div className="mt-4 p-3 bg-white rounded border">
              <p className="text-sm font-medium text-gray-700 mb-2">Serial Data (Debug)</p>
              <div className="text-xs text-gray-600 font-mono bg-gray-100 p-2 rounded">
                {JSON.stringify(finalResult.serialData, null, 2)}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Live Serial Data Display (when running) */}
      {testStatus === 'running' && serialData && (
        <div className="bg-blue-50 rounded-lg p-4 mb-6 border border-blue-200">
          <h4 className="text-sm font-medium text-blue-800 mb-2">Live Serial Data</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
            {Object.entries(serialData).map(([key, value]) => (
              <div key={key} className="bg-white p-2 rounded">
                <p className="text-gray-500 truncate">{key.replace(/_/g, ' ')}</p>
                <p className="font-medium text-blue-700">{value}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        {testStatus === 'ready' && (
          <button
            onClick={handleStartTest}
            className="flex items-center px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            <Play className="h-4 w-4 mr-2" />
            Start Test
          </button>
        )}

        {testStatus === 'running' && (
          <div className="flex gap-4 items-center">
            <div className="flex items-center text-yellow-600">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-yellow-600 mr-2"></div>
              Test in progress...
            </div>
            <button
              onClick={handleStopTest}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Stop Test
            </button>
          </div>
        )}

        {testStatus === 'completed' && (
          <div className="flex gap-4">
            <button
              onClick={handleRetryTest}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              Retry Test
            </button>
            <button
              onClick={handleSubmitResult}
              disabled={submitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit Result'}
            </button>
          </div>
        )}

        <button
          onClick={onCancel}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default FunctionalTestForm;
