import React from 'react';

const TestProgress = ({ testStatus, currentTest, testDuration, progressValue }) => {
  if (testStatus !== 'running') return null;

  return (
    <>
      {/* Progress Bar - only for tests with duration */}
      {currentTest.duration && (
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

      {/* Manual test duration display */}
      {!currentTest.duration && (
        <div className="mt-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Test Duration</span>
            <span>{testDuration}s (Manual Stop)</span>
          </div>
        </div>
      )}
    </>
  );
};

export default TestProgress;
