import React, { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore.js";
import { useVehicleStore } from "../store/useVehicleStore.js";

import MetricCard from "../components/MetricCard";

import done from "../assets/Vector-4.svg";
import car from "../assets/car.svg";
import clock from "../assets/Group.svg";
import { Clock1 } from "lucide-react";
const Dashboard = () => {
  const { user } = useAuthStore();



  const totalvehicles=useVehicleStore(state=>state.fetchTodayVehicles)
  const vehicles = useVehicleStore((state) => state.vehicles || []);
  const pendingVehicles = vehicles.filter((v) => v.status === 'PENDING');
  const INPROGRESSvehicles = vehicles.filter((v) => v.status === 'IN_PROGRESS');
  const CompletedVehicles = vehicles.filter((v) => v.status === 'COMPLETED');
  const APPROVEDVEHICLES = vehicles.filter((v) => v.status === 'APPROVED');
  const SENT_TO_NIC=vehicles.filter(v=>v.status==="SENT_TO_NIC")
  useEffect(()=>{

    totalvehicles();

 },[totalvehicles])


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
          title="Tests Approved"
          value={getCount(APPROVEDVEHICLES)}
          icon={done}
          color="green"
        />
        <MetricCard
          title="Tests Completed"
          value={getCount(CompletedVehicles)}
          icon={done}
          color="green"
        />
        <MetricCard
          title="Pending Tests"
          value={getCount(pendingVehicles)}
          icon={clock}
          color="yellow"
        />
         <MetricCard
          title="Tests InProgress"
          value={getCount(INPROGRESSvehicles)}
          icon={clock}
          color="yellow"
        />
          <MetricCard
          title="Tests Results awaited"
          value={getCount(SENT_TO_NIC)}
          icon={<Clock1/>}
          color="green"
        />
         
        
      </div>
    </div>
  );
};

export default Dashboard;
