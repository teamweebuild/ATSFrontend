import React, { useEffect, useState, useMemo } from "react";
import useTestStore from "../store/useTestStore";
import VehicleSelection from "../components/VehicleSelection";
import VehicleDetails from "../components/VehicleDetails";
import FunctionalTestForm from "../components/FunctionalTestForm";
import AlertMessage from "../components/AlertMessage";
import { Zap } from "lucide-react";

const FunctionalTestPage = () => {
  const {
    functionalVehicles,
    selectedVehicle,
    fetchPendingFunctionalVehicles,
    fetchVehicleByRegn,
    submitFunctionalTest,
  } = useTestStore();

  const [selectedRule, setSelectedRule] = useState("");
  const [selectedRegnNo, setSelectedRegnNo] = useState("");
  const [loading, setLoading] = useState(false);
  const [vehicleLoading, setVehicleLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showTestSelection, setShowTestSelection] = useState(true);
  const [showVehicleSelection, setShowVehicleSelection] = useState(false);
  const [showTestExecution, setShowTestExecution] = useState(false);

  const ITEMS_PER_PAGE = 20;

  // Available functional tests
  const functionalTests = [
    {
      id: 'rule189_37',
      name: 'Rule 189.37 - Acceleration Test',
      description: 'Measure vehicle acceleration performance according to Rule 189.37',
      icon: Zap,
      color: 'blue'
    }
  ];

  // Filter vehicles based on search term
  const filteredVehicles = useMemo(() => {
    if (!searchTerm) return functionalVehicles;
    return functionalVehicles.filter(regnNo => 
      regnNo.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [functionalVehicles, searchTerm]);

  // Pagination logic
  const totalPages = Math.ceil(filteredVehicles.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentVehicles = filteredVehicles.slice(startIndex, endIndex);

  // Reset pagination when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const loadPendingVehicles = async (rule) => {
    setLoading(true);
    setError("");
    try {
      await fetchPendingFunctionalVehicles(rule);
    } catch (err) {
      setError(`Failed to load pending vehicles for ${rule}`);
    } finally {
      setLoading(false);
    }
  };

  const handleTestSelect = async (test) => {
    setSelectedRule(test.id);
    setError("");
    setSuccess("");
    setSearchTerm("");
    setCurrentPage(1);
    
    // Load vehicles for this test rule
    await loadPendingVehicles(test.id);
    
    setShowTestSelection(false);
    setShowVehicleSelection(true);
  };

  const handleVehicleSelect = async (regnNo) => {
    setVehicleLoading(true);
    setError("");
    setSuccess("");
    setSelectedRegnNo(regnNo);
    
    try {
      await fetchVehicleByRegn(regnNo);
      setShowVehicleSelection(false);
      setShowTestExecution(true);
    } catch (err) {
      setError(`Failed to load vehicle details for ${regnNo}`);
      setSelectedRegnNo("");
    } finally {
      setVehicleLoading(false);
    }
  };

  const handleTestSubmit = async (rule, value) => {
    setSubmitting(true);
    setError("");
    setSuccess("");
    
    try {
      const res = await submitFunctionalTest(rule, value);
      setSuccess(res.message || "Functional test submitted successfully!");
      
      // Reset and go back to test selection
      setTimeout(() => {
        handleReset();
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit functional test");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setSelectedRule("");
    setSelectedRegnNo("");
    setError("");
    setSuccess("");
    setSearchTerm("");
    setCurrentPage(1);
    setShowTestSelection(true);
    setShowVehicleSelection(false);
    setShowTestExecution(false);
  };

  const handleBackToTestSelection = () => {
    setSelectedRule("");
    setError("");
    setSuccess("");
    setShowTestSelection(true);
    setShowVehicleSelection(false);
    setShowTestExecution(false);
  };

  const handleBackToVehicleSelection = () => {
    setSelectedRegnNo("");
    setError("");
    setSuccess("");
    setShowVehicleSelection(true);
    setShowTestExecution(false);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getSelectedTestName = () => {
    const test = functionalTests.find(t => t.id === selectedRule);
    return test ? test.name : "";
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-[90%] mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Functional Test Center</h2>

          {/* Error/Success Messages */}
          <AlertMessage type="error" message={error} />
          <AlertMessage type="success" message={success} />

          {/* Test Selection Section */}
          {showTestSelection && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-700 mb-6">
                Select Functional Test Type
              </h3>
              
              <div className="flex justify-center">
                <div className="w-full max-w-lg">
                  {functionalTests.map((test) => {
                  const Icon = test.icon;
                  return (
                    <div
                      key={test.id}
                      onClick={() => handleTestSelect(test)}
                      className="cursor-pointer bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-blue-500 hover:shadow-lg transition-all duration-200"
                    >
                      <div className="flex items-center mb-4">
                        <div className="p-3 bg-blue-100 rounded-full mr-4">
                          <Icon className="h-8 w-8 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-gray-800">{test.name}</h4>
                          <p className="text-sm text-gray-600">{test.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <button 
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                          Start Test
                        </button>
                      </div>
                    </div>
                  );
                })}
                </div>
              </div>
            </div>
          )}

          {/* Vehicle Selection Section */}
          {showVehicleSelection && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-700">
                    Select Vehicle for {getSelectedTestName()}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Choose a vehicle to perform the acceleration test
                  </p>
                </div>
                <button
                  onClick={handleBackToTestSelection}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                >
                  Back to Tests
                </button>
              </div>

              <VehicleSelection
                searchTerm={searchTerm}
                onSearchChange={handleSearchChange}
                filteredVehicles={filteredVehicles}
                currentVehicles={currentVehicles}
                loading={loading}
                vehicleLoading={vehicleLoading}
                onVehicleSelect={handleVehicleSelect}
                onRefresh={() => loadPendingVehicles(selectedRule)}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                startIndex={startIndex}
                endIndex={endIndex}
                title={`Select Vehicle for ${getSelectedTestName()}`}
              />
            </div>
          )}

          {/* Test Execution Section */}
          {showTestExecution && selectedVehicle && (
            <div>
              <VehicleDetails 
                vehicle={selectedVehicle} 
                onBack={handleBackToVehicleSelection}
              />
              
              <FunctionalTestForm
                selectedRule={selectedRule}
                onSubmit={handleTestSubmit}
                onCancel={handleReset}
                onBack={handleBackToVehicleSelection}
                submitting={submitting}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FunctionalTestPage;
