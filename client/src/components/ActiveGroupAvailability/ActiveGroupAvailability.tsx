import React, { useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { useAuth } from "src/auth/AuthProvider";
import useUserGroups from "../../hooks/useUserGroups";
import { useNavigate } from "react-router-dom";

type Props = {
  children?: any;
};

function ActiveGroupAvailability({ children }: Props) {
  const { loggedInUser } = useAuth();
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  const query = useUserGroups(loggedInUser.email);

  if (query.isLoading || !query.data?.length) {
    return null;
  }

  const group = query.data[0];

  const handleClose = () => {
    setOpen(false);
  };

  const handleAccept = () => {

    navigate(`group-page/${group.id}`, { replace: true })
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
          It's a group named <b>{group.name}</b><br/>
          Would you like to move in and collaborate with your friends?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Not now</Button>
        <Button onClick={handleAccept} autoFocus>
        Let's go
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ActiveGroupAvailability;
