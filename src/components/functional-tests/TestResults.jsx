import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

const TestResults = ({ finalResult, selectedRule, currentTest }) => {
  if (!finalResult) return null;

  return (
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
          <p className="text-sm text-gray-500">
            {selectedRule === 'rule189_4' ? 'Maximum Accuracy' : 'Final Reading'}
          </p>
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
      
      {/* Speedometer specific info */}
      {selectedRule === 'rule189_4' && finalResult.allReadings && (
        <div className="mt-4 p-3 bg-white rounded border">
          <p className="text-sm font-medium text-gray-700 mb-2">Speedometer Test Summary</p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Total Readings</p>
              <p className="font-medium">{finalResult.allReadings.length}</p>
            </div>
            <div>
              <p className="text-gray-500">Test Duration</p>
              <p className="font-medium">{finalResult.duration}s</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Serial Data Debug Info */}
      {finalResult.serialData && (
        <div className="mt-4 p-3 bg-white rounded border">
          <p className="text-sm font-medium text-gray-700 mb-2">Last Serial Data</p>
          <div className="text-xs text-gray-600 font-mono bg-gray-100 p-2 rounded max-h-32 overflow-y-auto">
            {selectedRule === 'rule189_4' && finalResult.serialData ? (
              <div className="space-y-1">
                <div>Current Speed: {finalResult.serialData.Current_Speed}</div>
                <div>Speedometer Reading: {finalResult.serialData.Speedometer_Reading}</div>
                <div>Speed Accuracy: {finalResult.serialData.Speed_Accuracy}</div>
                <div>RPM: {finalResult.serialData.RPM}</div>
              </div>
            ) : (
              JSON.stringify(finalResult.serialData, null, 2)
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TestResults;
