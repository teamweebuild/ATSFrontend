import React, { useEffect } from "react";
import {  Routes, Route, Navigate } from "react-router-dom";
import {useAuthStore} from "./store/useAuthStore";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Vehicles from "./pages/Vehicles";
import Tests from "./pages/Tests";
import Reports from "./pages/Reports";
import Approvals from "./pages/Approvals";
import Users from "./pages/Users";
import Settings from "./pages/Settings";

import Layout from "./components/Layout";
import VisualTestPage from "./pages/VisualTestPage";
import FunctionalTestPage from "./pages/FunctionalTestPage";


const App = () => {
 const { token, user, fetchUser } = useAuthStore();

  useEffect(() => {
    if (token && !user) {
      fetchUser();
    }
  }, [token, user, fetchUser]);

  return (
 
      <Routes>
        {/* Public route */}
        <Route path="/login" element={<Login />} />

        {/* Protected routes */}
        {token ? (
          <Route element={<Layout />}>

            <Route path="/" element={<Dashboard />} />
            <Route path="/vehicles" element={<Vehicles />} />
            <Route path="/tests" element={<Tests />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/visualtest" element={<VisualTestPage />} />
            <Route path="/functionaltest" element={<FunctionalTestPage />} />


            {/* Admin-only */}
            {user?.role === "ATS_ADMIN" && (
              <>
                <Route path="/approvals" element={<Approvals />} />
                <Route path="/users" element={<Users />} />
                <Route path="/settings" element={<Settings />} />
                {/* <Route path="/officerdashboard" element={<OfficerDashboard/>} /> */}
              </>
            )}


            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" />} />
          </Route>
        ) : (
          // If not logged in, redirect everything to login
          <Route path="*" element={<Navigate to="/login" />} />
        )}
      
      </Routes>

  );
};

export default App;
