import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';

// Import sub-components
import TestStatusDisplay from './functional-tests/TestStatusDisplay';
import SerialDataStatus from './functional-tests/SerialDataStatus';
import TestProgress from './functional-tests/TestProgress';
import TestResults from './functional-tests/TestResults';
import LiveSerialData from './functional-tests/LiveSerialData';
import TestActionButtons from './functional-tests/TestActionButtons';

// Import configurations and handlers
import { testConfigs } from './functional-tests/TestConfigs';
import { createSerialDataHandler, createTestCompletionHandler } from './functional-tests/TestHandlers';

const FunctionalTestForm = ({ 
  selectedRule, 
  onSubmit, 
  onCancel, 
  submitting,
  onBack 
}) => {
  // State management
  const [testStatus, setTestStatus] = useState('ready'); // ready | running | completed
  const [testDuration, setTestDuration] = useState(0);
  const [liveReading, setLiveReading] = useState(0);
  const [progressValue, setProgressValue] = useState(0);
  const [showProgressAfterDelay, setShowProgressAfterDelay] = useState(false);
  const [finalResult, setFinalResult] = useState(null);
  const [serialData, setSerialData] = useState(null);
  const [lastValidReading, setLastValidReading] = useState(0);
  const [maxAccuracy, setMaxAccuracy] = useState(0);
  const [allAccuracyReadings, setAllAccuracyReadings] = useState([]);

  const currentTest = testConfigs[selectedRule];

  // Serial data handler effect
  useEffect(() => {
    const handleSerialData = createSerialDataHandler(
      selectedRule,
      setSerialData,
      setLiveReading,
      setLastValidReading,
      setMaxAccuracy,
      setAllAccuracyReadings
    );

    // Set up the global serial data handler
    if (testStatus === 'running') {
      const wrappedHandler = (data) => {
        if (testStatus === 'running') {
          handleSerialData(data);
        }
      };
      window.onSerialData = wrappedHandler;
    } else {
      window.onSerialData = null;
    }

    // Cleanup on unmount
    return () => {
      if (window.onSerialData) {
        window.onSerialData = null;
      }
    };
  }, [testStatus, selectedRule]);

  // Timer Effect - handles different test types
  useEffect(() => {
    let interval = null;
    if (testStatus === 'running') {
      interval = setInterval(() => {
        setTestDuration(prev => prev + 1);

        if (testDuration >= 2 && !showProgressAfterDelay) {
          setShowProgressAfterDelay(true);
        }

        // Only auto-complete for tests with duration (not manual tests like speedometer)
        if (currentTest && currentTest.duration && showProgressAfterDelay) {
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

  // Event handlers
  const handleStartTest = () => {
    console.log(`Starting ${selectedRule === 'rule189_4' ? 'speedometer' : 'acceleration'} test - listening for serial data`);
    setTestStatus('running');
    setSerialData(null);
    setLiveReading(0);
    setLastValidReading(0);
    
    // Reset speedometer-specific values
    if (selectedRule === 'rule189_4') {
      setMaxAccuracy(0);
      setAllAccuracyReadings([]);
    }
  };

  const handleCompleteTest = (finalValue) => {
    const completionHandler = createTestCompletionHandler(
      selectedRule,
      maxAccuracy,
      allAccuracyReadings,
      testDuration,
      serialData,
      currentTest
    );
    
    const result = completionHandler(finalValue);
    setTestStatus('completed');
    setFinalResult(result);
    
    // Stop listening to serial data
    window.onSerialData = null;
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
    setMaxAccuracy(0);
    setAllAccuracyReadings([]);
    window.onSerialData = null;
  };

  const handleSubmitResult = () => {
    if (finalResult) {
      onSubmit(selectedRule, finalResult.value);
    }
  };

  const handleStopTest = () => {
    console.log("Stopping test manually");
    
    if (selectedRule === 'rule189_4') {
      handleCompleteTest(maxAccuracy);
    } else {
      handleCompleteTest(lastValidReading || liveReading || 0);
    }
  };

  // Error state
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

  // Main render
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-6">
      {/* Header */}
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
      <TestStatusDisplay
        currentTest={currentTest}
        selectedRule={selectedRule}
        liveReading={liveReading}
        maxAccuracy={maxAccuracy}
        progressValue={progressValue}
        testStatus={testStatus}
        showProgressAfterDelay={showProgressAfterDelay}
      />

      {/* Serial Data Status */}
      <SerialDataStatus testStatus={testStatus} serialData={serialData} />

      {/* Test Progress */}
      <TestProgress
        testStatus={testStatus}
        currentTest={currentTest}
        testDuration={testDuration}
        progressValue={progressValue}
      />

      {/* Test Results */}
      <TestResults
        finalResult={finalResult}
        selectedRule={selectedRule}
        currentTest={currentTest}
      />

      {/* Live Serial Data Display */}
      <LiveSerialData
        testStatus={testStatus}
        serialData={serialData}
        selectedRule={selectedRule}
      />

      {/* Action Buttons */}
      <TestActionButtons
        testStatus={testStatus}
        selectedRule={selectedRule}
        onStartTest={handleStartTest}
        onStopTest={handleStopTest}
        onRetryTest={handleRetryTest}
        onSubmitResult={handleSubmitResult}
        onCancel={onCancel}
        submitting={submitting}
      />
    </div>
  );
};

export default FunctionalTestForm;
