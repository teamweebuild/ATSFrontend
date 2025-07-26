
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
  totalVehicle:[],
  pendingVehiclesAll: [],
  completedVehicles: [],
  approvedVehicles: [],
  getVehiclesReadyForApproval: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get("/nic/ready");

      set({ readyVehicles: res.data, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },
  getTotalVehicles:async ()=>{
      try{
        const res=await axios.get("/vehicles/allvehicles");
        const filtered = res.data.filter((v) => v.status === "PENDING"|| v.status === "IN_PROGRESS");
        const completed=res.data.filter((v) => v.status === "COMPLETED");
        const approved=res.data.filter((v) => v.status === "APPROVED");
        set({totalVehicle:res.data, pendingVehiclesAll: filtered , completedVehicles:completed, approvedVehicles:approved});
      }
      catch(err){  
        console.error("Error fetching total vehicles:", err.message);
        set({ error: err.message });
      }
  },

  fetchTodayVehicles: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get("/vehicles/all");
      console.log(res.data);
      set({ vehicles: res.data, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  addVehicle: async (vehicleData) => {
    try {
      const res = await axios.post("/vehicles/", vehicleData);
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
