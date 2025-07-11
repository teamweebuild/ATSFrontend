import React from "react";
import { useAuthStore } from "../store/useAuthStore.js";

const Dashboard = () => {
  const { user } = useAuthStore();

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold text-blue-700">Dashboard</h1>

      {user ? (
        <div className="text-lg font-medium text-gray-700">
          Welcome, <span className="text-blue-600">{user.name}</span>!
          <div className="text-sm text-gray-500">Role: {user.role}</div>
        </div>
      ) : (
        <p className="text-red-500">Loading user...</p>
      )}
    </div>
  );
};

export default Dashboard;
