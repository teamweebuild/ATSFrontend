// import React, { useEffect, useState } from 'react';
// import { Search } from 'lucide-react';
// import car from '../assets/car.svg';
// import dayjs from 'dayjs';
// import { useVehicleStore } from '../store/useVehicleStore';
// import axios from 'axios';
// import axiosInstance from '../services/axiosInstance';

// const Approvals = () => {
//   const [searchBar, setSearchBar] = useState("");
//   const [types] = useState(["Bike", "Cars", "Lorry"]);
//   const [technicians] = useState(["All", "Suresh"]);
//   const [selectedType, setSelectedType] = useState("");
//   const [selectedTechnician, setSelectedTechnician] = useState("All");
//   const [vehicles, setVehicles] = useState([]);
//   const [selectedVehicle, setSelectedVehicle] = useState(null);
//   const [certificateType, setCertificateType] = useState("");
//   const [certificateStatus, setCertificateStatus] = useState("");
//   const [validFrom, setValidFrom] = useState("");
//   const [validTo, setValidTo] = useState("");
//   const [adminComments, setAdminComments] = useState("");
//   const [testInstances, setTestInstances] = useState([]);

//   const fetchgetreadyforApproval = useVehicleStore(state => state.getVehiclesReadyForApproval);
//   const vehicless = useVehicleStore(state => state.readyvehicles);

//   useEffect(() => {
//     fetchgetreadyforApproval(); // triggers API call
//   }, [fetchgetreadyforApproval]);

//   useEffect(() => {
//     setVehicles(vehicless);
//   }, [vehicless]);

//   useEffect(() => {
//     if (testInstances) {
//       const statuses = [
//         ...Object.values(testInstances.visualTests || {}),
//         ...Object.values(testInstances.functionalTests || {})
//       ];

//       const hasFailed = statuses.includes("FAILED");
//       const hasConditional = statuses.includes("CONDITIONAL");
//       const allPassed = statuses.every(status => status === "PASSED");

//       if (hasFailed) {
//         setCertificateStatus("FAILED");
//         setCertificateType("Not Eligible");
//         const today = dayjs().format("YYYY-MM-DD");
//         setValidFrom(today);
//         setValidTo(dayjs().add(90,'day').format("YYYY-MM-DD"));
//       } else if (hasConditional) {
//         setCertificateStatus("CONDITIONAL");
//         setCertificateType("Conditional Fitness Certificate");
//         const today = dayjs().format("YYYY-MM-DD");
//         setValidFrom(today);
//         setValidTo(dayjs().add(30, 'day').format("YYYY-MM-DD"));
//       } else if (allPassed) {
//         setCertificateStatus("ALL_PASSED");
//         setCertificateType("Full Fitness Certificate");
//         const today = dayjs().format("YYYY-MM-DD");
//         setValidFrom(today);
//         setValidTo(dayjs().add(2, 'year').format("YYYY-MM-DD"));
//       } else {
//         setCertificateStatus(""); // fallback if no tests found
//       }
//     }
//   }, [testInstances]);
//   const handleSearch = (e) => {
//     setSearchBar(e.target.value)
//     const searchTerm = e.target.value.toLowerCase();
//     const filtered = vehicless.filter(
//       (v) =>
//         v.bookingId.toLowerCase().includes(searchTerm) ||
//         v.regnNo.toLowerCase().includes(searchTerm)
//     );
//     setVehicles(filtered);
//   };
  

//   const handleSubmit = async (e) => {
//     e.preventDefault();


   

//     const payload = {
//       bookingId: selectedVehicle?.bookingId,
//       certificateType,
//       certificateStatus,
//       validFrom: validFrom || null,
//       validTo: validTo || null,
//       adminComments: adminComments || "",
//       issuedAt: new Date().toISOString(),
//     }; console.log('Sending payload:', payload);
    
//     // Use axios correctly
//     try {
//       const { data } = await axiosInstance.post('/nic/send', payload);
//       alert('Certificate issued successfully!');
//     } catch (err) {
//       console.error('Error:', err?.response?.data || err.message);
//     }
    
//   };

//   return (
//     <div className="space-y-6">
//       <div className="bg-white rounded-lg shadow-sm border border-gray-300 p-6 space-y-6">
//         <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
//           <h2 className="text-2xl font-bold text-gray-900">Pending Approvals</h2>
//           <div className="flex flex-col md:flex-row gap-4 w-full md:w-1/2">
//             <div className="flex items-center border gap-x-2 rounded-2xl px-3 py-1 flex-1">
//               <Search className="h-5 w-5 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Enter Vehicle..."
//                 value={searchBar}
//                 onChange={handleSearch}
//                 className="flex-1 outline-none"
//               />
//             </div>
//             <select
//               className="border rounded-2xl px-3 py-1 flex-1 text-center"
//               value={selectedType}
//               onChange={(e) => setSelectedType(e.target.value)}
//             >
//               <option value="">All Types</option>
//               {types.map((t) => (
//                 <option key={t} value={t}>{t}</option>
//               ))}
//             </select>
//             <select
//               className="border rounded-2xl px-3 py-1 flex-1 text-center"
//               value={selectedTechnician}
//               onChange={(e) => setSelectedTechnician(e.target.value)}
//             >
//               {technicians.map((tech) => (
//                 <option key={tech} value={tech}>{tech}</option>
//               ))}
//             </select>
//           </div>
//         </div>

//         <div className="overflow-x-auto">
//           <table className="min-w-full text-sm text-left text-gray-700">
//             <thead className="bg-gray-100 text-xs uppercase text-gray-500">
//               <tr>
//                 <th className="px-5 py-3">Vehicle ID</th>
//                 <th className="px-5 py-3">Chassis Number</th>
//                 <th className="px-5 py-3">Registration</th>
//                 <th className="px-5 py-3">Lane Entry</th>
//                 <th className="px-5 py-3">Technician</th>
//                 <th className="px-5 py-3">Status</th>
//                 <th className="px-5 py-3 text-center">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200">
//               { vehicles&&vehicles.map((v) => (
//                 <tr key={v.bookingId} className="hover:bg-gray-50">
//                   <td className="px-5 py-4 font-medium">{v.bookingId}</td>
//                   <td className="px-5 py-4">{v.chassisNo}</td>
//                   <td className="px-5 py-4">{v.regnNo}</td>
//                   <td className="px-5 py-4">{v.laneEntryTime}</td>
//                   <td className="px-5 py-4">{v.testInstances[0]?.submittedBy?.name}</td>
//                   <td className="px-5 py-4">{v.status}</td>
//                   <td className="px-5 py-4 text-center">
//                     <button
//                       onClick={() => {
//                         setSelectedVehicle(v);
//                         setTestInstances(v.testInstances[0]);
//                       }}
//                       className="text-blue-500 hover:underline"
//                     >
//                       Review
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {selectedVehicle && (
//         <div className="w-full space-y-6 bg-white">
//           <div className="flex flex-col md:flex-row justify-evenly items-center p-6 rounded-lg gap-7">
//             <div className="w-full md:w-1/3 space-y-4 bg-gray-100 rounded-xl p-6 h-fit">
//               <div className="flex items-center gap-4">
//                 <img src={car} alt="Vehicle" className="w-10 h-10" />
//                 <div>
//                   <p className="text-sm">{selectedVehicle.bookingId}</p>
//                   <p className="text-lg font-semibold">{selectedVehicle.regnNo}</p>
//                 </div>
//               </div>
//               <div className="space-y-1 text-sm">
//                 <div className="flex justify-between"><span className='text-base'>Registration:</span><span className='font-semibold'>{selectedVehicle.regnNo}</span></div>
//                 <div className="flex justify-between"><span className='text-base'>Technician:</span><span className='font-semibold'>{testInstances?.submittedBy?.name}</span></div>
//                 <div className="flex justify-between"><span className='text-base'>Test Date:</span><span className='font-semibold'>{testInstances?.updatedAt?.slice(0, 10)}</span></div>
//                 <div className="flex justify-between"><span className='text-base'>Status:</span><span className='font-semibold'>{selectedVehicle.status}</span></div>
//               </div>
//             </div>

//             <div className="w-full md:w-2/3 p-6 rounded-xl border-gray-200 justify-center items-center flex flex-col">
//               <div className="w-full md:w-2/3 bg-gray-100 p-6 rounded-xl">
//                 <h4 className="text-lg font-semibold mb-4">Test Summary</h4>

//                 <h5 className="text-base font-semibold mb-2">Visual Tests</h5>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//                   {Object.entries(testInstances.visualTests || {}).map(([item, status]) => (
//                     <div key={`visual-${item}`} className="flex justify-between px-4">
//                       <span className="capitalize">{item}</span>
//                       <span className={
//                         status === "PASSED"
//                           ? "text-green-600 font-semibold"
//                           : status === "CONDITIONAL"
//                             ? "text-yellow-600 font-semibold"
//                             : "text-red-600 font-semibold"
//                       }>
//                         {status}
//                       </span>
//                     </div>
//                   ))}
//                 </div>

//                 <h5 className="text-base font-semibold mb-2">Functional Tests</h5>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   {Object.entries(testInstances.functionalTests || {}).map(([item, status]) => (
//                     <div key={`functional-${item}`} className="flex justify-between px-4">
//                       <span className="capitalize">{item}</span>
//                       <span className={
//                         status === "PASSED"
//                           ? "text-green-600 font-semibold"
//                           : status === "CONDITIONAL"
//                             ? "text-yellow-600 font-semibold"
//                             : "text-red-600 font-semibold"
//                       }>
//                         {status}
//                       </span>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>

//           {certificateStatus === "FAILED" && (
//             <div className="p-4 bg-red-100 text-red-600 rounded">
//               This vehicle has failed tests and is not eligible for certificate issuance.
//             </div>
//           )}

//           <div className="bg-white p-6 rounded-lg space-y-4 border">
//             <h4 className="text-lg font-semibold">Issue Certificate</h4>
//             <div className="flex flex-col md:flex-row gap-4">
//               <div className="flex flex-col flex-1">
//                 <label className="text-sm">Validity Period</label>
//                 <div className="flex gap-2">
//                   <input type="date" value={validFrom} readOnly className="border rounded px-3 py-2 flex-1" />
//                   <span className="self-center">to</span>
//                   <input type="date" value={validTo} readOnly className="border rounded px-3 py-2 flex-1" />
//                 </div>
//               </div>
//             </div>
//             <button
//               className={`px-4 py-2 rounded ${certificateStatus === "FAILED" ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 text-white"}`}
//               onClick={handleSubmit}
              
//             >
//               Submit
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Approvals;
import React, { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import car from '../assets/car.svg';
import { useVehicleStore } from '../store/useVehicleStore';

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
  const vehicless = useVehicleStore(state => state.readyvehicles);

  useEffect(() => {
    fetchgetreadyforApproval(); // triggers API call
  }, [fetchgetreadyforApproval]);

  useEffect(() => {
    setVehicles(vehicless);
  }, [vehicless]);

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
                  <td className="px-5 py-4">{v.laneEntryTime}</td>
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

                <h5 className="text-base font-semibold mb-2">Visual Tests</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {Object.entries(testInstances.visualTests || {}).map(([item, status]) => (
                    <div key={`visual-${item}`} className="flex justify-between px-4">
                      <span className="capitalize">{item}</span>
                      <span className={
                        status === "PASSED"
                          ? "text-green-600 font-semibold"
                          : status === "CONDITIONAL"
                            ? "text-yellow-600 font-semibold"
                            : "text-red-600 font-semibold"
                      }>
                        {status}
                      </span>
                    </div>
                  ))}
                </div>

                <h5 className="text-base font-semibold mb-2">Functional Tests</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(testInstances.functionalTests || {}).map(([item, status]) => (
                    <div key={`functional-${item}`} className="flex justify-between px-4">
                      <span className="capitalize">{item}</span>
                      <span className={
                        status === "PASSED"
                          ? "text-green-600 font-semibold"
                          : status === "CONDITIONAL"
                            ? "text-yellow-600 font-semibold"
                            : "text-red-600 font-semibold"
                      }>
                        {status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Approvals;