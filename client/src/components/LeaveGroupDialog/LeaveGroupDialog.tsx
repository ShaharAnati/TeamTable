import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export const LeaveGroupDialog = ({isOpen, onApprove, onCancellation}): JSX.Element => {
    const dialogText = `${sessionStorage.getItem('user_email')}, 
    are you sure want to leave this team table?`
    return (
        <Dialog
            open={isOpen}
            onClose={onCancellation}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                {"Leaving already?"}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {dialogText}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onCancellation}>Stay</Button>
                <Button onClick={onApprove} autoFocus>
                    I'm sure
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default LeaveGroupDialog;