import React, { useState } from "react";
import { Button, Avatar, Typography, Box } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import StudentProfileBox from "./StudentProfileBox";

interface HeaderProps {
  isSidebarCollapsed: boolean;
}

const Header: React.FC<HeaderProps> = ({ isSidebarCollapsed }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const { studentData, studentToken } = useSelector(
    (state: RootState) => state.student
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
    >
      <Button
        onClick={handleClick}
        className="text-gray-700 flex items-center gap-1 border border-black rounded-lg"
      >
        <Avatar
          src={studentData?.image || "/default-avatar.jpg"}
          alt="Profile Picture"
          className="w-8 h-8"
        />
        {studentData && <Typography variant="body2">{studentData.name}</Typography>}
        <ArrowDropDownIcon />
      </Button>

      <StudentProfileBox
        anchorEl={anchorEl}
        open={open}
        handleClose={handleClose}
        image={studentData?.image || "/default-avatar.jpg"}
        name={studentData?.name || ""}
        token={studentToken}
      />
    </Box>
  );
};

export default Header;
