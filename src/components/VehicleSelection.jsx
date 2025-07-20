import React from "react";
import VehicleSearch from "../components/VehicleSearch";
import VehicleGrid from "../components/VehicleGrid";
import Pagination from "../components/Pagination";

const VehicleSelection = ({
  searchTerm,
  onSearchChange,
  filteredVehicles,
  currentVehicles,
  loading,
  vehicleLoading,
  onVehicleSelect,
  onRefresh,
  currentPage,
  totalPages,
  onPageChange,
  startIndex,
  endIndex,
  title = "Select Vehicle for Visual Test" // Default title
}) => {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-700">
          {title}
        </h3>
        <button
          onClick={onRefresh}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      <VehicleSearch 
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
        resultCount={filteredVehicles.length}
      />

      {currentVehicles.length > 0 ? (
        <>
          <VehicleGrid 
            vehicles={currentVehicles}
            onVehicleSelect={onVehicleSelect}
            loading={loading}
            disabled={vehicleLoading}
          />
          
          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
            startIndex={startIndex}
            endIndex={endIndex}
            totalItems={filteredVehicles.length}
          />
        </>
      ) : searchTerm ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">🔍 No vehicles found</p>
          <p className="text-sm mt-2">Try adjusting your search term</p>
        </div>
      ) : (
        <VehicleGrid 
          vehicles={[]}
          onVehicleSelect={onVehicleSelect}
          loading={loading}
          disabled={false}
        />
      )}

      {/* Loading State for Vehicle Selection */}
      {vehicleLoading && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"></div>
            <span className="text-blue-700">Loading vehicle details...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleSelection;
