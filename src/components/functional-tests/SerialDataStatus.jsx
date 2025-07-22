import React from 'react';

const SerialDataStatus = ({ testStatus, serialData }) => {
  if (testStatus !== 'running') return null;

  return (
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
  );
};

export default SerialDataStatus;
