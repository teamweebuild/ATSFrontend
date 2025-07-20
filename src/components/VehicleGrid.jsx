import React from "react";

const VehicleGrid = ({ vehicles, onVehicleSelect, loading, disabled }) => {
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (vehicles.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-lg">🎉 No pending vehicles for visual test</p>
        <p className="text-sm mt-2">All vehicles have been tested!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-5 gap-3 mb-6">
      {vehicles.map((regnNo, index) => (
        <button
          key={index}
          onClick={() => onVehicleSelect(regnNo)}
          disabled={disabled}
          className="px-3 py-4 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-blue-100 hover:text-blue-700 transition-all duration-200 disabled:opacity-50 text-sm"
        >
          {regnNo}
        </button>
      ))}
    </div>
  );
};

export default VehicleGrid;
