// src/store/useVehicleStore.js
import { create } from "zustand";
import axios from "../services/axiosInstance";
import { vehicleData } from "../assets/DummyData";

export const useVehicleStore = create((set, get) => ({
  vehicles: [],
  loading: false,
  error: null,
  readyvehicles:[],
  reportVehicles:[],
  getVehiclesReadyForApproval :async()=>{
    set({ loading: true, error: null });
    try{
      const res=await axios.get('/nic/ready')
      set({readyvehicles:res.data})
    }
    catch(err){
      set({ error: err.message});
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
        // Optional: push it into the current list immediately
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
  submittedVehicles:async()=>{
    try{
      const res=await axios.get("/nic/logs/allvehicles");
      set({reportVehicles:res.data})

    }
    catch(e){
    console.log(e)
    }
  }
}));
