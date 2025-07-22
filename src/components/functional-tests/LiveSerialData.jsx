import React from 'react';

const LiveSerialData = ({ testStatus, serialData, selectedRule }) => {
  if (testStatus !== 'running' || !serialData) return null;

  return (
    <div className="bg-blue-50 rounded-lg p-4 mb-6 border border-blue-200">
      <h4 className="text-sm font-medium text-blue-800 mb-2">Live Serial Data</h4>
      {selectedRule === 'rule189_4' && serialData.test_type === 'speedometer_hd' ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <div className="bg-white p-3 rounded shadow-sm">
            <p className="text-xs text-gray-500">Current Speed</p>
            <p className="font-semibold text-blue-700">{serialData.Current_Speed || 'N/A'}</p>
          </div>
          <div className="bg-white p-3 rounded shadow-sm">
            <p className="text-xs text-gray-500">Speedometer Reading</p>
            <p className="font-semibold text-blue-700">{serialData.Speedometer_Reading || 'N/A'}</p>
          </div>
          <div className="bg-white p-3 rounded shadow-sm">
            <p className="text-xs text-gray-500">Speed Accuracy</p>
            <p className="font-semibold text-blue-700">{serialData.Speed_Accuracy || 'N/A'}</p>
          </div>
          <div className="bg-white p-3 rounded shadow-sm">
            <p className="text-xs text-gray-500">RPM</p>
            <p className="font-semibold text-blue-700">{serialData.RPM || 'N/A'}</p>
          </div>
          <div className="bg-white p-3 rounded shadow-sm">
            <p className="text-xs text-gray-500">Distance Traveled</p>
            <p className="font-semibold text-blue-700">{serialData.Distance_Traveled || 'N/A'}</p>
          </div>
          <div className="bg-white p-3 rounded shadow-sm">
            <p className="text-xs text-gray-500">Elapsed Time</p>
            <p className="font-semibold text-blue-700">{serialData.Elapsed_Time || 'N/A'}</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
          {Object.entries(serialData).map(([key, value]) => (
            <div key={key} className="bg-white p-2 rounded">
              <p className="text-gray-500 truncate">{key.replace(/_/g, ' ')}</p>
              <p className="font-medium text-blue-700">{value}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LiveSerialData;
