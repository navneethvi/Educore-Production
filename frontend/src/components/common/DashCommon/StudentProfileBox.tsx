import React from "react";
import { Menu, MenuItem, Avatar, Typography } from "@mui/material";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../store/store";
import { useNavigate } from "react-router-dom";
import { studentLogout } from "../../../redux/students/studentActions";

interface ProfileBoxProps {
  anchorEl: null | HTMLElement;
  open: boolean;
  handleClose: () => void;
  image: string;
  name: string;
  token: string | null;
}

const StudentProfileBox: React.FC<ProfileBoxProps> = ({
  anchorEl,
  open,
  handleClose,
  image,
  name,
  token,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    handleClose();
    if (token) {
      await dispatch(studentLogout(token));
      navigate("/signin", {
        state: { message: "Logout Successfull" },
      });
    }
  };

  const handleProfile = () => {
    navigate("/profile");
  };

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      sx={{
        width: 220,
        borderRadius: 2,
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        padding: "8px 0",
      }}
    >
      <MenuItem
        onClick={handleProfile}
        sx={{
          fontSize: "1rem",
          width: 270,
          padding: "12px 20px",
          "&:hover": {
            backgroundColor: "#f0f0f0",
          },
          display: "flex",
          alignItems: "center",
        }}
      >
        <Typography variant="body1">Profile</Typography>
      </MenuItem>
      <MenuItem
        onClick={handleLogout}
        sx={{
          fontSize: "1rem",
          padding: "12px 20px",
          color: "#d32f2f", // Red text color for Logout
          "&:hover": {
            backgroundColor: "#fbe9e7", // Light red background on hover
          },
          borderRadius: 1,
        }}
      >
        Logout
      </MenuItem>
    </Menu>
  );
};

export default StudentProfileBox;
