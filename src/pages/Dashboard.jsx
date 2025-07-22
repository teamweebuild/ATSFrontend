import React, { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore.js";
import { useVehicleStore } from "../store/useVehicleStore.js";

import MetricCard from "../components/MetricCard";

import done from "../assets/Vector-4.svg";
import car from "../assets/car.svg";
import clock from "../assets/Group.svg";

const Dashboard = () => {
  const { user } = useAuthStore();



  const totalvehicles=useVehicleStore(state=>state.fetchTodayVehicles)
  const vehicles = useVehicleStore((state) => state.vehicles || []);
  const submittedVehiclesFn=useVehicleStore((state)=>state.submittedVehicles);
  const submittedVehicles=useVehicleStore((state)=>state.reportVehicles);
  const pendingVehicleFN=useVehicleStore(s=>s.pendingVehicles);
const pendingvehicle=useVehicleStore(s=>s.pendingVehiclesForTest)
  useEffect(()=>{
    submittedVehiclesFn();
    totalvehicles();
    pendingVehicleFN();
 },[submittedVehiclesFn,totalvehicles,pendingVehicleFN])


  const getCount = (arr) => arr?.length || 0;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-blue-700">Dashboard</h1>

      {user ? (
        <div className="text-lg font-medium text-gray-700">
          Welcome, <span className="text-blue-600">{user.name}</span>!
          <div className="text-sm text-gray-500">Role: {user.role}</div>
        </div>
      ) : (
        <p className="text-red-500">Loading user...</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MetricCard
          title="Total Tests"
          value={getCount(vehicles)}
          icon={car}
          color="blue"
        />
        <MetricCard
          title="Tests Completed"
          value={getCount(submittedVehicles)}
          icon={done}
          color="green"
        />
        <MetricCard
          title="Pending Tests"
          value={getCount(pendingvehicle)}
          icon={clock}
          color="yellow"
        />
      </div>
    </div>
  );
};

export default Dashboard;
