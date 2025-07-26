import React, { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import car from '../assets/car.svg';
import { useVehicleStore } from '../store/useVehicleStore';
import axios from 'axios';
import axiosInstance from '../services/axiosInstance';

const Approvals = () => {
  const [searchBar, setSearchBar] = useState("");
  const [types] = useState(["Bike", "Cars", "Lorry"]);
  const [technicians] = useState(["All", "Suresh"]);
  const [selectedType, setSelectedType] = useState("");
  const [selectedTechnician, setSelectedTechnician] = useState("All");
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [testInstances, setTestInstances] = useState([]);

  const fetchgetreadyforApproval = useVehicleStore(state => state.getVehiclesReadyForApproval);
  const vehicless = useVehicleStore(state => state.readyVehicles);

  useEffect(() => {
    fetchgetreadyforApproval(); // triggers API call
  }, [fetchgetreadyforApproval]);

  useEffect(() => {
    setVehicles(vehicless);
  }, [vehicless]);
  console.log(vehicless)
  const handleSearch = (e) => {
    setSearchBar(e.target.value);
    const searchTerm = e.target.value.toLowerCase();
    const filtered = vehicless.filter(
      (v) =>
        v.bookingId.toLowerCase().includes(searchTerm) ||
        v.regnNo.toLowerCase().includes(searchTerm)
    );
    setVehicles(filtered);
  };
  console.log(selectedVehicle)
  const handleSubitNIC = async (e) => {
    e.preventDefault();
  
    const regnNo = selectedVehicle.regnNo; // ✅ No destructuring needed
    try {
      const res = await axiosInstance.post("/nic/send", { regnNo });
      if (res.status === 200) {
        alert("Vehicle data successfully sent to NIC");
      } else {
        alert("Failed to send vehicle data");
      }
    } catch (error) {
      console.error(error);
      alert("Error sending data to NIC");
    }
  };
  

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-300 p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <h2 className="text-2xl font-bold text-gray-900">Pending Approvals</h2>
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-1/2">
            <div className="flex items-center border gap-x-2 rounded-2xl px-3 py-1 flex-1">
              <Search className="h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Enter Vehicle..."
                value={searchBar}
                onChange={handleSearch}
                className="flex-1 outline-none"
              />
            </div>
            <select
              className="border rounded-2xl px-3 py-1 flex-1 text-center"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="">All Types</option>
              {types.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <select
              className="border rounded-2xl px-3 py-1 flex-1 text-center"
              value={selectedTechnician}
              onChange={(e) => setSelectedTechnician(e.target.value)}
            >
              {technicians.map((tech) => (
                <option key={tech} value={tech}>{tech}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left text-gray-700">
            <thead className="bg-gray-100 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-5 py-3">Vehicle ID</th>
                <th className="px-5 py-3">Chassis Number</th>
                <th className="px-5 py-3">Registration</th>
                <th className="px-5 py-3">Lane Entry</th>
                <th className="px-5 py-3">Technician</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {vehicles && vehicles.map((v) => (
                <tr key={v.bookingId} className="hover:bg-gray-50">
                  <td className="px-5 py-4 font-medium">{v.bookingId}</td>
                  <td className="px-5 py-4">{v.chassisNo}</td>
                  <td className="px-5 py-4">{v.regnNo}</td>
                  <td className="px-5 py-4">{v.laneEntryTime.slice(0, 16).replace("T", " ")}</td>
                  <td className="px-5 py-4">{v.testInstances[0]?.submittedBy?.name}</td>
                  <td className="px-5 py-4">{v.status}</td>
                  <td className="px-5 py-4 text-center">
                    <button
                      onClick={() => {
                        setSelectedVehicle(v);
                        setTestInstances(v.testInstances[0]);
                      }}
                      className="text-blue-500 hover:underline"
                    >
                      Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedVehicle && (
          <>
        <div className="w-full space-y-6 bg-white">
          <div className="flex flex-col md:flex-row justify-evenly items-center p-6 rounded-lg gap-7">
            <div className="w-full md:w-1/3 space-y-4 bg-gray-100 rounded-xl p-6 h-fit">
              <div className="flex items-center gap-4">
                <img src={car} alt="Vehicle" className="w-10 h-10" />
                <div>
                  <p className="text-sm">{selectedVehicle.bookingId}</p>
                  <p className="text-lg font-semibold">{selectedVehicle.regnNo}</p>
                </div>
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between"><span className='text-base'>Registration:</span><span className='font-semibold'>{selectedVehicle.regnNo}</span></div>
                <div className="flex justify-between"><span className='text-base'>Technician:</span><span className='font-semibold'>{testInstances?.submittedBy?.name}</span></div>
                <div className="flex justify-between"><span className='text-base'>Test Date:</span><span className='font-semibold'>{testInstances?.updatedAt?.slice(0, 10)}</span></div>
                <div className="flex justify-between"><span className='text-base'>Status:</span><span className='font-semibold'>{selectedVehicle.status}</span></div>
              </div>
            </div>

            <div className="w-full md:w-2/3 p-6 rounded-xl border-gray-200 justify-center items-center flex flex-col">
              <div className="w-full md:w-2/3 bg-gray-100 p-6 rounded-xl">
                <h4 className="text-lg font-semibold mb-4">Test Summary</h4>

             
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <h5 className="text-base font-semibold mb-2">Visual Tests</h5>
                  {/* {Object.entries(testInstances.visualTest || {}).map(([item, status]) => (
                    <div key={`visual-${item}`} className="flex justify-between px-4">
                      <span className="capitalize">{item}</span>
                      <span className={
                        status === "P"
                          ? "text-green-600 font-semibold"
                          : status === "F"
                            ? "text-yellow-600 font-semibold"
                            : "text-red-600 font-semibold"
                      }>
                        {status}

                      </span>
                    </div>
                    
                  ))} */}
                   {testInstances?.visualTest.isCompleted?<span className='text-green-500'>All Submitted</span>:"Some left"}
                </div>

          
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <h5 className="text-base font-semibold mb-2">Functional Tests</h5>
                  {/* {Object.entries(testInstances.functionalTest || {}).map(([item, status]) => (
                    <div key={`functional-${item}`} className="flex justify-between px-4">
                      <span className="capitalize">{item}</span>
                      <span >
                        {status}
                      </span>
                    </div>
                  ))} */}
                     {testInstances?.functionalTest.isCompleted?<span className='text-green-500'>All Submitted</span>:"Some left"}
                </div>
              </div>
            </div>
          </div>
        </div>
<div> <button className='bg-red-500 text-white  p-4 rounded-2xl' onClick={handleSubitNIC} >Send To NIC</button> </div>
      </> 
      )}
    </div>
  );
};

export default Approvals;