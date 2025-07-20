import React from "react";

const VehicleDetails = ({ vehicle, onBack }) => {
  return (
    <div>
      {/* Back Button */}
      <div className="mb-6">
        <button
          onClick={onBack}
          className="flex items-center text-blue-600 hover:text-blue-700"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Vehicle Selection
        </button>
      </div>

      {/* Vehicle Details */}
      <div className="mb-8 p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Vehicle Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            {/* {console.log(vehicle)} */}
            <div>
              <span className="text-sm font-medium text-gray-500">Booking ID:</span>
              <p className="text-lg font-medium text-gray-800">{vehicle.bookingId}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Registration Number:</span>
              <p className="text-lg font-medium text-blue-600">{vehicle.regnNo}</p>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <span className="text-sm font-medium text-gray-500">Engine Number:</span>
              <p className="text-lg font-medium text-gray-800">{vehicle.engineNo}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Chassis Number:</span>
              <p className="text-lg font-medium text-gray-800">{vehicle.chassisNo}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetails;
