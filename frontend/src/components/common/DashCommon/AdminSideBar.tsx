import React from "react";
import { Box, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import PersonIcon from "@mui/icons-material/Person";
import Category from "@mui/icons-material/Category";
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';

interface SideBarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const AdminSideBar: React.FC<SideBarProps> = ({ isCollapsed, onToggle }) => {
  const handleFoldClick = () => {
    onToggle();
  };

  const location = useLocation(); // Hook to get the current route

  const sidebarItems = [
    { to: "/admin/dashboard", icon: <DashboardIcon />, label: "Dashboard" },
    { to: "/admin/courses", icon: <LibraryBooksIcon />, label: "Courses" },
    { to: "/admin/students", icon: <PersonIcon />, label: "Students" },
    { to: "/admin/tutors", icon: <SupervisorAccountIcon />, label: "Tutors" },
    { to: "/admin/category", icon: <Category />, label: "Category" },
  ];

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: isCollapsed ? "80px" : "240px",
        transition: "width 0.3s ease",
        color: "#fff",
        height: "100vh",
        zIndex: 1200,
      }}
      className="bg-zinc-900 shadow-lg"
    >
      <div className="flex items-center p-2">
        <IconButton onClick={handleFoldClick} sx={{ color: "#fff" }}>
          {isCollapsed ? <MenuIcon /> : <MenuOpenIcon />}
        </IconButton>
        {!isCollapsed && (
          <h1 className="text-2xl font-reem-kufi pl-4 pr-4">EDUCORE</h1>
        )}
      </div>
      <nav className="flex-1 p-4">
        <ul className="space-y-4">
          {sidebarItems.map((item, index) => {
            const isActive = location.pathname === item.to;

            return (
              <motion.li
                key={index}
                initial={{ opacity: 0, scale: 0.5, filter: "blur(10px)" }}
                animate={{
                  opacity: isCollapsed ? 0 : 1,
                  scale: isCollapsed ? 0.5 : 1,
                  filter: isCollapsed ? "blur(10px)" : "blur(0px)",
                }}
                transition={{ delay: 0.05 * index + 0.1 }}
              >
                <Link
                  to={item.to}
                  className={`p-2 rounded flex items-center space-x-4 mb-4 ${
                    isActive ? "bg-gray-700" : "hover:bg-gray-700"
                  }`}
                  onClick={(e) => {
                    if (isCollapsed) {
                      e.preventDefault();
                    }
                  }}
                >
                  {React.cloneElement(item.icon, {
                    className: `w-6 h-6 ${isActive ? "text-purple-400" : "text-white"}`,
                  })}
                  {!isCollapsed && (
                    <span className={`${isActive ? "text-purple-400" : "text-white"}`}>
                      {item.label}
                    </span>
                  )}
                </Link>
              </motion.li>
            );
          })}
        </ul>
      </nav>
    </Box>
  );
};

export default AdminSideBar;
