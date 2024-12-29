import React, { useState } from "react";
import { Button, Avatar, Typography, Box } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import AdminProfileBox from "./AdminProfileBox";

interface HeaderProps {
  isSidebarCollapsed: boolean;
}

const Header: React.FC<HeaderProps> = ({ isSidebarCollapsed }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const { adminData, adminToken } = useSelector(
    (state: RootState) => state.admin
  );

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box
      className={`flex justify-end items-center p-2 border-b border-gray-300 bg-white transition-all duration-300 ${
        isSidebarCollapsed ? "pl-20" : "pl-60"
      }`}
      style={{ height: "64px", marginBottom: "0", boxSizing: "border-box" }} 
    >
      <Button
        onClick={handleClick}
        className="text-gray-700 flex items-center gap-1 border border-black rounded-lg"
      >
        <Avatar
          src={adminData?.image || "/default-avatar.jpg"}
          alt="Profile Picture"
          className="w-8 h-8"
        />
        {adminData && <Typography variant="body2">{adminData.name}</Typography>}
        <ArrowDropDownIcon />
      </Button>

      <AdminProfileBox
        anchorEl={anchorEl}
        open={open}
        handleClose={handleClose}
        image={adminData?.image || "/default-avatar.jpg"}
        name={adminData?.name || ""}
        token={adminToken}
      />
    </Box>
  );
};

export default Header;
