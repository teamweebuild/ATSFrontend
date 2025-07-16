import React, { useEffect, useState } from 'react'
import { useVehicleStore } from '../store/useVehicleStore'
import axiosInstance from '../services/axiosInstance'

// 🗂️ Keys that use visualSchema (image upload only)
const visualImageKeys = [
  "rule189_7_Visual",
  "rule189_12a_Visual",
  "rule189_12b_Visual",
  "rule189_16_Visual",
  "rule189_27_Visual",
  "rule189_31_Visual",
  "rule189_34_Visual",
  "rule189_37_Visual",
  "imgFront",
  "imgLeft",
  "imgRight",
  "imgEngine",
  "imgChassis"
]

const VisualTest = () => {
  const fetchTests = useVehicleStore(s => s.fetchTests)
  const filteredFetch = useVehicleStore(s => s.filteredFetch)
  const filteredVehi = useVehicleStore(s => s.filteredVehi)
  const searchbarFn = useVehicleStore(s => s.updateSearchbar)
  const clearFilteredVehi = useVehicleStore(s => s.clearFilteredVehi)
  const removeFilteredTest = useVehicleStore(s => s.removeFilteredTest)
  const getVehicleDetails = useVehicleStore(s => s.getVehicleDetails)
  const currentVehicle = useVehicleStore(s => s.currentVehicle)

  const [bookingId, setBookingId] = useState("")

  // Clear tests when navigating away
  useEffect(() => {
    return () => {
      clearFilteredVehi()
    }
  }, [clearFilteredVehi])

  // Fetch vehicle details when bookingId changes
  useEffect(() => {
    if (bookingId.trim()) {
      getVehicleDetails(bookingId.trim())
    }
  }, [bookingId, getVehicleDetails])

  // Search by booking ID
  const searchVehicleTest = async () => {
    if (!bookingId.trim()) {
      alert("Please enter a valid Booking ID")
      return
    }
    searchbarFn(bookingId.trim())
    try {
      const result = await fetchTests(bookingId.trim())
      await filteredFetch(result)
    } catch (err) {
      alert("Error: Please enter a valid Booking ID.")
    }
  }

  // Approve/Reject handler
  const handleSubmit = async (code, isApproved) => {
    const status = isApproved ? "true" : "false"
    try {
      await axiosInstance.post(`/tests/submitTest/${bookingId.trim()}`, {
        rule: code,
        status
      })
      removeFilteredTest(code)
      alert(`Test ${isApproved ? "approved" : "rejected"} ✅`)
    } catch (err) {
      console.error(err)
      alert("Error submitting test ❌")
    }
  }

  // Upload image handler
  const handleImageUpload = async (e, code) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = async () => {
      const base64String = reader.result
      try {
        await axiosInstance.post(`/tests/submitTest/${bookingId.trim()}`, {
          rule: code,
          image: base64String
        })
        removeFilteredTest(code)
        alert("Image uploaded ✅")
      } catch (err) {
        console.error(err)
        alert("Error uploading image ❌")
      }
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">Visual Test Approval</h1>

      {/* Search bar */}
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Enter Booking ID"
          value={bookingId}
          onChange={(e) => setBookingId(e.target.value)}
          className="border border-gray-300 rounded px-4 py-2 w-full sm:w-auto"
        />
        <button
          onClick={searchVehicleTest}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
        >
          Search
        </button>
      </div>

      {/* Vehicle details card */}
      {currentVehicle && Object.keys(currentVehicle).length > 0 && (
        <div className="border border-gray-200 rounded-lg p-4 mb-6 bg-gray-50">
          <h2 className="text-lg font-semibold mb-2 text-gray-800">Vehicle Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-700">
            <div><strong>Regn No:</strong> {currentVehicle.regnNo}</div>
            <div><strong>Booking ID:</strong> {currentVehicle.bookingId}</div>
            <div><strong>Chassis No:</strong> {currentVehicle.chassisNo}</div>
            <div><strong>Engine No:</strong> {currentVehicle.engineNo}</div>
            <div><strong>Status:</strong> {currentVehicle.status}</div>
            <div><strong>Lane Entry:</strong> {new Date(currentVehicle.laneEntryTime).toLocaleString()}</div>
            <div><strong>ATS Center:</strong> {currentVehicle.atsCenter?.name || 'N/A'}</div>
            <div><strong>Created:</strong> {new Date(currentVehicle.createdAt).toLocaleString()}</div>
            <div><strong>Updated:</strong> {new Date(currentVehicle.updatedAt).toLocaleString()}</div>
          </div>
        </div>
      )}

      {/* Filtered tests */}
      {Object.keys(filteredVehi || {}).length === 0 ? (
        <p className="text-center text-gray-500">No tests to show. Search by Booking ID.</p>
      ) : (
        <div className="space-y-4">
          {Object.entries(filteredVehi).map(([code, v]) => (
            <div
              key={code}
              className="flex flex-col sm:flex-row justify-between items-center border border-gray-200 rounded p-4 shadow-sm bg-white"
            >
              <div className="flex-1 mb-2 sm:mb-0">
                <span className="font-semibold text-lg">{code}</span>
              </div>

              {visualImageKeys.includes(code) ? (
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, code)}
                  className="border p-2"
                />
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSubmit(code, true)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleSubmit(code, false)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default VisualTest
