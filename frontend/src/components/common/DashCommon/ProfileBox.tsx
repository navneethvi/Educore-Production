import React from "react";
import { Menu, MenuItem, Avatar, Typography } from "@mui/material";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../store/store";
import { useNavigate } from "react-router-dom";
import { tutorLogout } from "../../../redux/tutors/tutorActions";
import { resetActions } from "../../../redux/tutors/tutorSlice";

interface ProfileBoxProps {
  anchorEl: null | HTMLElement;
  open: boolean;
  handleClose: () => void;
  image: string;
  name: string;
  token: string | null;
}

const ProfileBox: React.FC<ProfileBoxProps> = ({
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
      await dispatch(tutorLogout(token));
      dispatch(resetActions()); // Reset Redux state
      navigate("/tutor/signin", {
        state: { message: "Logout Successful" }, // You can add this message
      });
    }
  };

  const handleProfile = () => {
    navigate("/tutor/profile");
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
        <Avatar src={image} alt={name} sx={{ marginRight: 2 }} />
        <Typography variant="body1">{name}</Typography>
      </MenuItem>
      <MenuItem
        onClick={handleLogout}
        sx={{
          fontSize: "1rem",
          width: 270,
          padding: "12px 20px",
          "&:hover": {
            backgroundColor: "#f0f0f0",
          },
        }}
      >
        Logout
      </MenuItem>
    </Menu>
  );
};

export default ProfileBox;
