import React from 'react';

const TestStatusDisplay = ({ 
  currentTest, 
  selectedRule, 
  liveReading, 
  maxAccuracy, 
  progressValue, 
  testStatus, 
  showProgressAfterDelay 
}) => {
  return (
    <div className="bg-gray-50 rounded-lg p-4 mb-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div>
          <p className="text-sm text-gray-500">Max Value</p>
          <p className="font-semibold">{currentTest.maxValue} {currentTest.unit}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">
            {selectedRule === 'rule189_4' ? 'Current Accuracy' : 'Current Reading'}
          </p>
          <p className="font-semibold">
            {showProgressAfterDelay ? liveReading.toFixed(2) : '0.00'} {currentTest.unit}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">
            {selectedRule === 'rule189_4' ? 'Max Accuracy' : 'Progress'}
          </p>
          <p className="font-semibold">
            {selectedRule === 'rule189_4' ? 
              `${maxAccuracy.toFixed(2)} ${currentTest.unit}` : 
              `${progressValue.toFixed(0)}%`
            }
          </p>
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
    </div>
  );
};

export default TestStatusDisplay;
