import React, { useEffect } from 'react'
import MetricCard from '../components/MetricCard'

import done from "../assets/Vector-4.svg";
import car from "../assets/car.svg";
import clock from "../assets/Group.svg";
import { useVehicleStore } from '../store/useVehicleStore.js';


const OfficerDashboard = () => {
  
  const totalvehiclesFN=useVehicleStore(s=>s.getTotalVehicles);
  const vehicles=useVehicleStore(s=>s.totalVehicle);
  const pendingVehiclesAll=useVehicleStore(s=>s.pendingVehiclesAll);
  const completedVehicles=useVehicleStore(s=>s.completedVehicles);
  useEffect(() => {
    totalvehiclesFN();
  }
  , [totalvehiclesFN]);
    const getCount=(data)=>{
      return data.length;
    }
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-300 p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MetricCard
          title="Total Tests"
          value={getCount(vehicles)}
          icon={car}
          color="blue"
        />
        <MetricCard
          title="Tests Completed"
          value={getCount(completedVehicles)}
          icon={done}
          color="green"
        />
        <MetricCard
          title="Pending Tests"
          value={getCount(pendingVehiclesAll)}
          icon={clock}
          color="yellow"
        />
          <MetricCard
          title="Tests Approved"
          value={getCount(vehicles.filter(v => v.status === "APPROVED"))}
          icon={done}
          color="green"
        />

      </div>

  <div>
        
  </div>
       </div>
    </div>
  )
}

export default OfficerDashboard