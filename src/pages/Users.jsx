import React, { useEffect, useState } from "react";
import axiosInstance from "../services/axiosInstance";
import { useAuthStore } from "../store/useAuthStore";

const UserPage = () => {
  const { user } = useAuthStore();
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    if (user?.role === "ATS_ADMIN") fetchTechnicians();
    // console.log("User role:", user?.role);
  }, [user]);

  const fetchTechnicians = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/users/technicians");
      setTechnicians(res.data);
    } catch (err) {
      console.error("Error fetching technicians:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddTechnician = async (e) => {
    e.preventDefault();
    setFormError(null);
    try {
      await axiosInstance.post("/users/technician", form);
      setForm({ name: "", email: "", password: "" });
      setShowModal(false);
      fetchTechnicians();
    } catch (err) {
      console.error("Error adding technician:", err);
      setFormError(err?.response?.data?.message || "Failed to add technician.");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-10">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Technicians</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          + Add Technician
        </button>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        {loading ? (
          <p>Loading...</p>
        ) : technicians.length === 0 ? (
          <p className="text-gray-500">No technicians found.</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {technicians.map((tech) => (
              <li key={tech._id} className="py-3">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{tech.name}</p>
                    <p className="text-sm text-gray-500">{tech.email}</p>
                  </div>
                  <span
                    className={`text-sm   px-2 py-1 rounded ${
                      tech.role == "TECHNICIAN"
                        ? "text-blue-600 bg-blue-100"
                        : "text-green-600 bg-green-100"
                    }`}
                  >
                    {tech.role}
                  </span>
                
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80  flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl relative">
            <button
              className="absolute top-5 right-5 text-3xl text-gray-500 hover:text-gray-700"
              onClick={() => setShowModal(false)}
            >
              ✕
            </button>
            <h2 className="text-xl font-semibold mb-4">Add Technician</h2>
            <form onSubmit={handleAddTechnician} className="space-y-4">
              <div>
                <label className="block font-medium">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleFormChange}
                  required
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring"
                />
              </div>
              <div>
                <label className="block font-medium">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleFormChange}
                  required
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring"
                />
              </div>
              <div>
                <label className="block font-medium">Password</label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleFormChange}
                  required
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring"
                />
              </div>
              {formError && <p className="text-red-500 text-sm">{formError}</p>}
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                Add Technician
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserPage;