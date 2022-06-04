import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useAuth } from "src/auth/AuthProvider";
import useUserGroups from "../../hooks/useUserGroups";
import { useNavigate, useLocation } from "react-router-dom";

function ActiveGroupAvailability() {
  const { loggedInUser } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const shouldShowModal = !location.pathname.startsWith("/group-page");

  const query = useUserGroups(loggedInUser?.email, () => {
    if (shouldShowModal) setOpen(true);
  });

  if (!shouldShowModal || query.isLoading || !query.data?.length) {
    return null;
  }

  const group = query.data[0];

  const handleClose = () => {
    setOpen(false);
  };

  const handleAccept = () => {
    navigate(`group-page/${group.id}`, { replace: true });
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {"We're seeing activity in a group you are a part of"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          It's a group named <b>{group.name}</b>
          <br />
          Would you like to move in and collaborate with your friends?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Not now</Button>
        <Button onClick={handleAccept}>Let's go</Button>
      </DialogActions>
    </Dialog>
  );
}

export default ActiveGroupAvailability;
