import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store/store";
const Profile = () => {
  const tutorData = useSelector((state: RootState) => state.tutor?.tutorData);

  const [openModal, setOpenModal] = useState(false);
  const [name, setName] = useState(tutorData?.name || "");
  const [phone, setPhone] = useState(tutorData?.phone || "");
  const [bio, setBio] = useState(tutorData?.bio || "");

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);
  const handleSubmit = () => {
    handleCloseModal();
  };

  if (!tutorData) {
    return <Typography>Loading...</Typography>; 
  }

  return (
    <Box
      flex={1}
      display="flex"
      flexDirection="row"
      sx={{ p: 2, overflow: "auto" }}
    >
      {/* Left Container */}
      <Box
        display="flex"
        flexDirection="column"
        flex={1}
        gap={2}
        color={"black"}
      >
        <Typography variant="h4" mb={4} className="font-reem-kufi">
          Tutor Profile
        </Typography>

        <Box display="flex" flexDirection="column" gap={4}>
          <TextField
            className="font-reem-kufi"
            id="outlined-read-only-input-name"
            label="Name"
            defaultValue={tutorData?.name || ""}
            InputProps={{
              readOnly: true,
            }}
            fullWidth
          />
          <TextField
            id="outlined-read-only-input-email"
            label="Email"
            defaultValue={tutorData?.email || ""}
            InputProps={{
              readOnly: true,
            }}
            fullWidth
          />
          <TextField
            id="outlined-read-only-input-phone"
            label="Phone No"
            defaultValue={tutorData?.phone || ""}
            InputProps={{
              readOnly: true,
            }}
            fullWidth
          />

          <TextField
            aria-label="Demo input"
            label="Bio"
            multiline
            rows={3}
            fullWidth
            variant="outlined"
            value={tutorData?.bio || ""}
            placeholder={tutorData?.bio ? "" : "Add Something to your bio"}
            InputProps={{
              readOnly: true,
            }}
          />

          <Button
            variant="contained"
            color="primary"
            sx={{
              mt: 2,
              width: 300,
              mx: "auto",
              display: "block",
              textAlign: "center",
              borderRadius: 2,
              padding: "10px 20px",
            }}
            onClick={handleOpenModal} 
          >
            Change Account Info
          </Button>
        </Box>
      </Box>

      {/* Right Container */}
      <Box
        display="flex"
        flexDirection="column"
        flex={1}
        justifyContent="top"
        mt={10}
        alignItems="center"
        sx={{ p: 2, borderRadius: 1, backgroundColor: "#ffffff" }}
      >
        <Avatar
          src={tutorData?.image || "/default-avatar.jpg"}
          alt="Profile Picture"
          sx={{ width: 100, height: 100, mb: 2 }}
        />
        <Typography variant="h6" mb={1}>
          {tutorData?.name || "Unknown"}
        </Typography>

        {tutorData?.followers !== undefined && (
          <Typography variant="body2" color="textSecondary" mb={2}>
            Followers: {tutorData?.followers}
          </Typography>
        )}
        <Button variant="contained" color="primary" sx={{ mt: 1 }}>
          Change Profile
        </Button>
      </Box>

      {/* Modal for Changing Account Info */}
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: 2,
            padding: 3,
            boxShadow: 24,
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: "bold" }}>
          Change Account Info
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Name"
            type="text"
            fullWidth
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            id="phone"
            label="Phone No"
            type="text"
            fullWidth
            variant="outlined"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            id="bio"
            label="Bio"
            type="text"
            fullWidth
            variant="outlined"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="error">
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Profile;
