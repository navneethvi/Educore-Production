import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSideBar from "./AdminSideBar";
import Header from "./AdminHeader";
import { Box } from "@mui/material";

const Layout: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleToggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <Box className="flex h-screen">
      <div className="hidden sm:block">
      <AdminSideBar
        isCollapsed={isSidebarCollapsed}
        onToggle={handleToggleSidebar}
      />
      </div>
      <Box
        className={`flex flex-col flex-grow transition-all duration-300  ${
          isSidebarCollapsed ? "sm:ml-20" : "sm:ml-60"
        }`}
      >
        <Header isSidebarCollapsed={isSidebarCollapsed} />
        <Box className="flex-grow p-4 bg-gray-100 "> {/* Adjust margin-top to avoid overlap */}
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
