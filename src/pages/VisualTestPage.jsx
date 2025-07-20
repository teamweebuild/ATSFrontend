import React, { useEffect, useState, useMemo } from "react";
import useTestStore from "../store/useTestStore";

const VisualTestPage = () => {
  const {
    vehicles,
    selectedVehicle,
    visualRules,
    fetchPendingVisualVehicles,
    fetchVehicleByRegn,
    setVisualRules,
    submitVisualTest,
    resetVisualRules,
  } = useTestStore();

  const [selectedRegnNo, setSelectedRegnNo] = useState("");
  const [loading, setLoading] = useState(false);
  const [vehicleLoading, setVehicleLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showVehicleSelection, setShowVehicleSelection] = useState(true);
  
  const ITEMS_PER_PAGE = 20; // 5x4 grid

  useEffect(() => {
    loadPendingVehicles();
  }, []);

  // Filter vehicles based on search term
  const filteredVehicles = useMemo(() => {
    if (!searchTerm) return vehicles;
    return vehicles.filter(regnNo => 
      regnNo.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [vehicles, searchTerm]);

  // Pagination logic
  const totalPages = Math.ceil(filteredVehicles.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentVehicles = filteredVehicles.slice(startIndex, endIndex);

  // Reset pagination when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const loadPendingVehicles = async () => {
    setLoading(true);
    setError("");
    try {
      await fetchPendingVisualVehicles();
    } catch (err) {
      setError("Failed to load pending vehicles");
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = async (regnNo) => {
    setVehicleLoading(true);
    setError("");
    setSuccess("");
    setSelectedRegnNo(regnNo);
    resetVisualRules();
    
    try {
      await fetchVehicleByRegn(regnNo);
      setShowVehicleSelection(false); // Hide vehicle selection section
    } catch (err) {
      setError(`Failed to load vehicle details for ${regnNo}`);
      setSelectedRegnNo("");
    } finally {
      setVehicleLoading(false);
    }
  };

  const handleRuleChange = (rule, value) => {
    setVisualRules({ ...visualRules, [rule]: value });
  };

  const handleSubmit = async () => {
    if (!selectedVehicle) {
      setError("Please select a vehicle first");
      return;
    }

    // Check if at least one rule is set
    const hasRules = Object.keys(visualRules).length > 0;
    if (!hasRules) {
      setError("Please set at least one visual test result");
      return;
    }

    setSubmitting(true);
    setError("");
    setSuccess("");
    
    try {
      const res = await submitVisualTest();
      setSuccess(res.message || "Visual test submitted successfully!");
      
      // Reset everything and show vehicle selection again
      setSelectedRegnNo("");
      resetVisualRules();
      setShowVehicleSelection(true);
      
      // Refresh pending vehicles list
      await loadPendingVehicles();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit visual test");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setSelectedRegnNo("");
    resetVisualRules();
    setError("");
    setSuccess("");
    setShowVehicleSelection(true);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Visual Test Center</h2>

          {/* Error/Success Messages */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
          
          {success && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
              {success}
            </div>
          )}

          {/* Vehicle Selection Section */}
          {showVehicleSelection && (
            <div className="mb-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-700">
                  Select Vehicle for Visual Test
                </h3>
                <button
                  onClick={loadPendingVehicles}
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? "Refreshing..." : "Refresh"}
                </button>
              </div>

              {/* Search Bar */}
              <div className="mb-6">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search vehicle by registration number..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
                {searchTerm && (
                  <p className="mt-2 text-sm text-gray-600">
                    Found {filteredVehicles.length} vehicle(s) matching "{searchTerm}"
                  </p>
                )}
              </div>

              {/* Vehicle Grid */}
              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : currentVehicles.length > 0 ? (
                <>
                  <div className="grid grid-cols-5 gap-3 mb-6">
                    {currentVehicles.map((regnNo, index) => (
                      <button
                        key={index}
                        onClick={() => handleSelect(regnNo)}
                        disabled={vehicleLoading}
                        className="px-3 py-4 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-blue-100 hover:text-blue-700 transition-all duration-200 disabled:opacity-50 text-sm"
                      >
                        {regnNo}
                      </button>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center items-center space-x-2">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        Previous
                      </button>
                      
                      <div className="flex space-x-1">
                        {[...Array(totalPages)].map((_, i) => {
                          const page = i + 1;
                          return (
                            <button
                              key={page}
                              onClick={() => handlePageChange(page)}
                              className={`px-3 py-2 rounded-md ${
                                currentPage === page
                                  ? "bg-blue-600 text-white"
                                  : "border border-gray-300 hover:bg-gray-50"
                              }`}
                            >
                              {page}
                            </button>
                          );
                        })}
                      </div>
                      
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        Next
                      </button>
                    </div>
                  )}

                  <div className="mt-4 text-center text-sm text-gray-600">
                    Showing {startIndex + 1}-{Math.min(endIndex, filteredVehicles.length)} of {filteredVehicles.length} vehicles
                  </div>
                </>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  {searchTerm ? (
                    <div>
                      <p className="text-lg">🔍 No vehicles found</p>
                      <p className="text-sm mt-2">Try adjusting your search term</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-lg">🎉 No pending vehicles for visual test</p>
                      <p className="text-sm mt-2">All vehicles have been tested!</p>
                    </div>
                  )}
                </div>
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
          )}

          {/* Vehicle Details and Test Section - Only shown when vehicle is selected */}
          {selectedVehicle && !showVehicleSelection && (
            <div>
              {/* Back Button */}
              <div className="mb-6">
                <button
                  onClick={handleReset}
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
                    <div>
                      <span className="text-sm font-medium text-gray-500">Booking ID:</span>
                      <p className="text-lg font-medium text-gray-800">{selectedVehicle.bookingId}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Registration Number:</span>
                      <p className="text-lg font-medium text-blue-600">{selectedVehicle.regnNo}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-500">Engine Number:</span>
                      <p className="text-lg font-medium text-gray-800">{selectedVehicle.engineNo}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Chassis Number:</span>
                      <p className="text-lg font-medium text-gray-800">{selectedVehicle.chassisNo}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Visual Test Form */}
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-800">Visual Test Results</h3>
                  <button
                    onClick={() => resetVisualRules()}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Clear Form
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { key: "lights", label: "Lights", icon: "💡" },
                    { key: "mirrors", label: "Mirrors", icon: "🪞" },
                    { key: "horn", label: "Horn", icon: "📯" },
                    { key: "brakes", label: "Brakes", icon: "🛑" },
                    { key: "wiper", label: "Wipers", icon: "🌧️" },
                    { key: "indicators", label: "Indicators", icon: "🔄" },
                  ].map((rule) => (
                    <div key={rule.key} className="space-y-2">
                      <label className="flex items-center text-sm font-medium text-gray-700">
                        <span className="mr-2">{rule.icon}</span>
                        {rule.label}
                      </label>
                      <select
                        value={visualRules[rule.key] || ""}
                        onChange={(e) => handleRuleChange(rule.key, e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select Result</option>
                        <option value="P">✅ Pass</option>
                        <option value="F">❌ Fail</option>
                        <option value="NA">➖ Not Applicable</option>
                      </select>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex gap-4">
                  <button
                    onClick={handleSubmit}
                    disabled={submitting || Object.keys(visualRules).length === 0}
                    className="flex-1 bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    {submitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white inline-block mr-2"></div>
                        Submitting...
                      </>
                    ) : (
                      "Submit Visual Test"
                    )}
                  </button>
                  
                  <button
                    onClick={handleReset}
                    disabled={submitting}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VisualTestPage;
