// /store/useTestStore.js
import { create } from "zustand";
import axiosInstance from "../services/axiosInstance";

const useTestStore = create((set, get) => ({
  vehicles: [],
  selectedVehicle: null,
  visualRules: {},
  functionalVehicles: [],
  functionalRules: {},

  setVisualRules: (rules) => set({ visualRules: rules }),
  resetVisualRules: () => set({ visualRules: {} }),
  setFunctionalRules: (rules) => set({ functionalRules: rules }),
  resetFunctionalRules: () => set({ functionalRules: {} }),

fetchPendingVisualVehicles: async () => {
  try {
    const res = await axiosInstance.get("tests/visual/pending");
    console.log("Fetched pending visual vehicles:", res.data);
    const pendingVehicles = res.data?.pending || [];
    set({ vehicles: Array.isArray(pendingVehicles) ? pendingVehicles : [] });
  } catch (err) {
    console.error("❌ Error fetching pending vehicles:", err);
    set({ vehicles: [] });
  }
},


  fetchVehicleByRegn: async (regnNo) => {
    try {
      const res = await axiosInstance.get(`vehicles/regn/${regnNo}`);
      set({ selectedVehicle: res.data });
    } catch (err) {
      console.error("❌ Error fetching vehicle by regn:", err);
      set({ selectedVehicle: null });
    }
  },

  submitVisualTest: async () => {
    const { selectedVehicle, visualRules } = get();
    if (!selectedVehicle || !selectedVehicle.regnNo) throw new Error("Vehicle not selected");

    try {
      const res = await axiosInstance.post("tests/visual/submit", {
        regnNo: selectedVehicle.regnNo,
        rules: visualRules,
      });
      return res.data;
    } catch (err) {
      console.error("❌ Error submitting visual test:", err);
      throw err;
    }
  },

  // Functional test methods
  fetchPendingFunctionalVehicles: async (rule) => {
    try {
      const res = await axiosInstance.get(`tests/functional/pending/${rule}`);
      console.log("Fetched pending functional vehicles:", res.data);
      const pendingVehicles = Array.isArray(res.data) ? res.data : [];
      set({ functionalVehicles: pendingVehicles });
    } catch (err) {
      console.error("❌ Error fetching pending functional vehicles:", err);
      set({ functionalVehicles: [] });
    }
  },

  submitFunctionalTest: async (rule, value) => {
    const { selectedVehicle } = get();
    if (!selectedVehicle || !selectedVehicle.regnNo) throw new Error("Vehicle not selected");

    try {
      const res = await axiosInstance.post("tests/functional/submit", {
        regnNo: selectedVehicle.regnNo,
        rule: rule,
        value: value,
      });
      return res.data;
    } catch (err) {
      console.error("❌ Error submitting functional test:", err);
      throw err;
    }
  },
}));

export default useTestStore;
