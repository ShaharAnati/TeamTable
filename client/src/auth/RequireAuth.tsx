import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { Navigate, useLocation } from "react-router-dom";
import { TokenState, useAuth } from './AuthProvider';
import { Button } from '@mui/material';

const RequireAuth = ({ children }: { children: JSX.Element }) => {
    let location = useLocation();
    const { isTokenValid, refreshToken } = useAuth();
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(true);

    const onDialogClose = () => {
        setIsDialogOpen(false);
        refreshToken();
    }

    if (isTokenValid() === TokenState.VALID) {
        return children;
    } else if (isTokenValid() === TokenState.EXPIRED) {
        return (
            <div>
                <Dialog open={isDialogOpen} >
                    <DialogTitle>You've been gone for a while</DialogTitle>
                    <DialogContent>
                        let's see what we can do
                    </DialogContent>
                    <DialogActions>
                        <Button autoFocus onClick={() => onDialogClose()}>
                            OK
                        </Button>
                    </DialogActions>
                </Dialog>
                {children}
            </div>
        )
    } else {
        return <Navigate to="/login-screen" state={{ from: location }} replace />;
    }
}

export default RequireAuth;
