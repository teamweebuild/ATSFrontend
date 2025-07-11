import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import {
  LayoutDashboard,
  Bus,
  ClipboardList,
  FileText,
  Users,
  Settings,
  CheckCircle,
  X,
} from "lucide-react";

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { user } = useAuthStore();
  // const user = {
  //   role: "ATS_ADMIN", 
  // }

  const isActive = (path) => location.pathname.startsWith(path);

  const menuItems = [
    { to: "/dashboard", label: "Dashboard", icon: <LayoutDashboard className="w-5 h-5" />, roles: ["ATS_ADMIN", "TECHNICIAN"] },
    { to: "/vehicles", label: "Vehicles", icon: <Bus className="w-5 h-5" />, roles: ["ATS_ADMIN", "TECHNICIAN"] },
    { to: "/tests", label: "Tests", icon: <ClipboardList className="w-5 h-5" />, roles: ["ATS_ADMIN","TECHNICIAN"] },
    { to: "/reports", label: "Reports", icon: <FileText className="w-5 h-5" />, roles: ["ATS_ADMIN", "TECHNICIAN"] },
    { to: "/approvals", label: "Approvals", icon: <CheckCircle className="w-5 h-5" />, roles: ["ATS_ADMIN"] },
    { to: "/users", label: "Users", icon: <Users className="w-5 h-5" />, roles: ["ATS_ADMIN"] },
    { to: "/settings", label: "Settings", icon: <Settings className="w-5 h-5" />, roles: ["ATS_ADMIN"] },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <div
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-white shadow-md transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 md:static md:shadow-none`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="bg-blue-600 text-white w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm">ATS</div>
            <span className="text-lg font-semibold text-blue-800">ATS System</span>
          </div>
          <button
            className="md:hidden text-gray-500 hover:text-gray-700 p-2"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Menu */}
        <nav className="px-4 py-6">
          <div className="space-y-2">
            {menuItems
              .filter((item) => item.roles.includes(user?.role))
              .map(({ to, label, icon }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={onClose}
                  className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition 
                    ${isActive(to)
                      ? "bg-blue-100 text-blue-700 font-semibold"
                      : "text-gray-700 hover:bg-gray-100"}`}
                >
                  {icon}
                  <span className="ml-3">{label}</span>
                </Link>
              ))}
          </div>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
