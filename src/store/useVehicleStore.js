// // // src/store/useVehicleStore.js
// // import { create } from "zustand";
// // import axios from "../services/axiosInstance";
// // import { vehicleData } from "../assets/DummyData";

// // export const useVehicleStore = create((set, get) => ({
// //   vehicles: [],
// //   loading: false,
// //   error: null,
// //   readyvehicles:[],
// //   reportVehicles:[],
// //   pendingVehiclesfortest:[],
// //   vehicleTest:[],
// //   getVehiclesReadyForApproval :async()=>{
// //     set({ loading: true, error: null });
// //     try{
// //       const res=await axios.get('/nic/ready')
// //       set({readyvehicles:res.data})
// //     }
// //     catch(err){
// //       set({ error: err.message});
// //     }
// //   },
// //   fetchTodayVehicles: async () => {
// //     set({ loading: true, error: null });
// //     try {
// //       const res = await axios.get("/vehicles/today");
// //       set({ vehicles: res.data, loading: false });
// //     } catch (err) {
// //       set({ error: err.message, loading: false });
// //     }
// //   },
  
// //   addVehicle: async (vehicleData) => {
// //     try {
// //       const res = await axios.post("/vehicles", vehicleData);
// //       if (res?.data) {
// //         // Optional: push it into the current list immediately
// //         set((state) => ({
// //           vehicles: [res.data, ...state.vehicles],
// //         }));
// //         return true;
// //       }
// //     } catch (err) {
// //       console.error("Error adding vehicle:", err.response?.data || err.message);
// //       throw err;
// //     }
// //   },
// //   submittedVehicles:async()=>{
// //     try{
// //       const res=await axios.get("/nic/logs/allvehicles");
// //       set({reportVehicles:res.data})

// //     }
// //     catch(e){
// //     console.log(e)
// //     }
// //   },
// //   pendingVehicles: async () => {
// //     const vehicles = get().vehicles;
// //     const filtered = vehicles.filter(v => v.status === "PENDING");
// //     set({ pendingVehiclesfortest: filtered });
// //   },

// //   filteredVehicles:async(VehicleData)=>{
// //     set({vehicleTest:VehicleData})
// //   }

// // }));
// // src/store/useVehicleStore.js
// import { create } from "zustand";
// import axios from "../services/axiosInstance";

// export const useVehicleStore = create((set, get) => ({
//   vehicles: [],
//   readyvehicles: [],
//   reportVehicles: [],
//   pendingVehiclesfortest: [],
//   vehicleTest: null,  // ✅ single test instance

//   loading: false,
//   error: null,
// filteredVehi:null,
//   // ✅ Get vehicles ready for approval
//   getVehiclesReadyForApproval: async () => {
//     set({ loading: true, error: null });
//     try {
//       const res = await axios.get("/nic/ready");
//       set({ readyvehicles: res.data, loading: false });
//     } catch (err) {
//       set({ error: err.message, loading: false });
//     }
//   },

//   // ✅ Fetch all today's vehicles
//   fetchTodayVehicles: async () => {
//     set({ loading: true, error: null });
//     try {
//       const res = await axios.get("/vehicles/today");
//       set({ vehicles: res.data, loading: false });
//     } catch (err) {
//       set({ error: err.message, loading: false });
//     }
//   },

//   // ✅ Add new vehicle
//   addVehicle: async (vehicleData) => {
//     try {
//       const res = await axios.post("/vehicles", vehicleData);
//       if (res?.data) {
//         set((state) => ({
//           vehicles: [res.data, ...state.vehicles],
//         }));
//         return true;
//       }
//     } catch (err) {
//       console.error("Error adding vehicle:", err.response?.data || err.message);
//       throw err;
//     }
//   },

//   // ✅ Fetch submitted vehicles
//   submittedVehicles: async () => {
//     try {
//       const res = await axios.get("/nic/logs/allvehicles");
//       set({ reportVehicles: res.data });
//     } catch (e) {
//       console.error(e);
//     }
//   },

//   // ✅ Filter pending vehicles for test
//   pendingVehicles: () => {
//     const vehicles = get().vehicles;
//     const filtered = vehicles.filter((v) => v.status === "PENDING");
//     set({ pendingVehiclesfortest: filtered });
//   },

//   // ✅ Set single vehicle test instance
//   setVehicleTest: (vehicleData) => {
//     set({ vehicleTest: vehicleData });
//   },
 
//   fetchTests: async (bookingId) => {
//     const res = await axios.get(`/tests/getTest/${bookingId}`);
//     set({ vehicleTest: res.data });
//     return res.data;
//   },
  
 
//   filteredFetch: async (vehicleData) => {
//     const tests = vehicleData || {};
//     const filteredTests = Object.entries(tests)
//       .filter(([_, v]) => v?.status !== "completed")
//       .map(([code, v]) => ({
//         code,
//         ...v,
//       }));
//     set({ filteredVehi: filteredTests });
//   },
  
  

// }));
import { create } from "zustand";
import axios from "../services/axiosInstance";
import axiosInstance from "../services/axiosInstance";

export const useVehicleStore = create((set, get) => ({
  vehicles: [],
  readyVehicles: [],
  reportVehicles: [],
  pendingVehiclesForTest: [],
  vehicleTest: null,
  filteredVehi: [],
  loading: false,
  error: null,
  searchbar:"",
  currentVehicle:[],
  getVehiclesReadyForApproval: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get("/nic/ready");
      set({ readyVehicles: res.data, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  fetchTodayVehicles: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get("/vehicles/today");
      set({ vehicles: res.data, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  addVehicle: async (vehicleData) => {
    try {
      const res = await axios.post("/vehicles", vehicleData);
      if (res?.data) {
        set((state) => ({
          vehicles: [res.data, ...state.vehicles],
        }));
        return true;
      }
    } catch (err) {
      console.error("Error adding vehicle:", err.response?.data || err.message);
      throw err;
    }
  },

  submittedVehicles: async () => {
    try {
      const res = await axios.get("/nic/logs/allvehicles");
      set({ reportVehicles: res.data });
    } catch (err) {
      console.error(err);
    }
  },

  pendingVehicles: () => {
    const vehicles = get().vehicles || [];
    const filtered = vehicles.filter((v) => v.status === "PENDING");
    set({ pendingVehiclesForTest: filtered });
  },

  fetchTests: async (bookingId) => {
    try {
      const res = await axios.get(`/tests/getTest/${bookingId}`);
      console.log("Fetched tests:", res.data);
      set({ vehicleTest: res.data });
      return res.data;
    } catch (err) {
      console.error("Error fetching test:", err.message);
      throw err;
    }
  },

  filteredFetch: async (visualTests) => {
    const filteredObject = Object.fromEntries(
      Object.entries(visualTests || {}).filter(([_, v]) => v?.status === "Pending")
    );
  
    console.log("Filtered object:", filteredObject);
    set({ filteredVehi: filteredObject });
  },
  updateSearchbar:async(data)=>{
    set({searchbar:data})
  },
  removeFilteredTest: (code) => {
    const current = get().filteredVehi;

    const { [code]: _, ...rest } = current;
    set({ filteredVehi: rest });
  },
  clearFilteredVehi: () => set({ filteredVehi: {} }),

  getVehicleDetails:async(bookingId)=>{
    const res=await axiosInstance.get(`/vehicles/${bookingId}`)
    set({currentVehicle:res.data})
  }
}));
