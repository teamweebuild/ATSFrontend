import React, { useEffect, useState, useMemo } from "react";
import useTestStore from "../store/useTestStore";
import VehicleSelection from "../components/VehicleSelection";
import VehicleDetails from "../components/VehicleDetails";
import VisualTestForm from "../components/VisualTestForm";
import AlertMessage from "../components/AlertMessage";

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
    <div className="min-h-screen  p-6">
      <div className="max-w-[90%] mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Visual Test Center</h2>

          {/* Error/Success Messages */}
          <AlertMessage type="error" message={error} />
          <AlertMessage type="success" message={success} />

          {/* Vehicle Selection Section */}
          {showVehicleSelection && (
            <VehicleSelection
              searchTerm={searchTerm}
              onSearchChange={handleSearchChange}
              filteredVehicles={filteredVehicles}
              currentVehicles={currentVehicles}
              loading={loading}
              vehicleLoading={vehicleLoading}
              onVehicleSelect={handleSelect}
              onRefresh={loadPendingVehicles}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              startIndex={startIndex}
              endIndex={endIndex}
            />
          )}

          {/* Vehicle Details and Test Section */}
          {selectedVehicle && !showVehicleSelection && (
            <div>
              <VehicleDetails vehicle={selectedVehicle} onBack={handleReset} />
              <VisualTestForm
                visualRules={visualRules}
                onRuleChange={handleRuleChange}
                onSubmit={handleSubmit}
                onCancel={handleReset}
                onClearForm={() => resetVisualRules()}
                submitting={submitting}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VisualTestPage;5
