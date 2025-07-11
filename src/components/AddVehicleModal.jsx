import React, { useState } from "react";
import { useVehicleStore } from "../store/useVehicleStore";
import { useAuthStore } from "../store/useAuthStore";

const AddVehicleModal = ({ isOpen, onClose }) => {
  const { user } = useAuthStore();
  const refreshVehicles = useVehicleStore((s) => s.fetchTodayVehicles);
  const addVehicle = useVehicleStore((s) => s.addVehicle);


  const [vehicleData, setVehicleData] = useState({
    bookingId: "",
    regnNo: "",
    engineNo: "",
    chassisNo: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVehicleData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await addVehicle(vehicleData);
      if (res) {
        alert("Vehicle Added Successfully");
        refreshVehicles();
        setVehicleData({ bookingId: "", regnNo: "", engineNo: "", chassisNo: "" });
        onClose();
      }
    } catch (error) {
      console.error("Error adding vehicle:", error.response?.data || error.message);
    }
  };

  if (!isOpen || user?.role !== "ATS_ADMIN") return null;

  return (
    <div className="fixed inset-0 bg-black/80   z-50 flex justify-center items-center">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 w-full max-w-md relative">
        <button onClick={onClose} className="absolute cursor-pointer right-5 text-4xl top-5 text-gray-900 hover:text-gray-700">
          &times;
        </button>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Add Vehicle</h2>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          {[
            { label: "Booking ID", name: "bookingId" },
            { label: "Registration Number", name: "regnNo" },
            { label: "Engine Number", name: "engineNo" },
            { label: "Chassis Number", name: "chassisNo" },
          ].map(({ label, name }) => (
            <div key={name}>
              <label className="block mb-1 font-medium text-gray-700">{label}</label>
              <input
                type="text"
                name={name}
                value={vehicleData[name]}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
              />
            </div>
          ))}

          <button
            type="submit"
            className="mt-2 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
          >
            Add Vehicle
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddVehicleModal;
