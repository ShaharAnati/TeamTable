import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export const JoinGroupDialog = ({isOpen, onApprove, onCancellation, group}): JSX.Element => {
    const dialogText = `You've been invited to join to ${group.creator}'s team table.\n
    Would you like to join this table?`
    return (
            <Dialog
                open={isOpen}
                onClose={onCancellation}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Hello " + sessionStorage.getItem('user_email') + "!"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {dialogText}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onCancellation}>I rather not</Button>
                    <Button onClick={onApprove} autoFocus>
                        I want to join
                    </Button>
                </DialogActions>
            </Dialog>
    );
}

export default JoinGroupDialog;