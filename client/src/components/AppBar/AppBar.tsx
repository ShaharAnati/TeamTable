import * as React from 'react';
import {Link, useNavigate} from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Menu from '@mui/material/Menu';
import {TokenState, useAuth} from '../../auth/AuthProvider';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
// @ts-ignore
import logo from '@assets/images/TeamTableLogo.png'
import {Button} from '@mui/material';

const MenuAppBar = () => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const navigate = useNavigate();

    const auth = useAuth();

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const navigateHome = () => {
        navigate("/", {replace: true});
    }

    return (
        <AppBar position="relative" style={{background: 'white', zIndex: 1}}>
            <Toolbar>
                <Box sx={{flexGrow: 1}}>
                    <Box
                        component="img"
                        sx={{
                            height: 64,
                            cursor: 'pointer'
                        }}
                        alt="logo"
                        src={logo}
                        onClick={navigateHome}
                    />
                </Box>
                <div>
                    {auth?.loggedInUser?.isAdmin &&
                        <Button component={Link} to="/verify-restaurant" sx={{color: '#266d70', fontWeight: 600}}>Admin
                            Manage</Button>}
                    <IconButton
                        size="large"
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={handleMenu}>
                        <AccountCircle/>
                    </IconButton>
                    <Menu
                        id="menu-appbar"
                        anchorEl={anchorEl}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                        {auth.isTokenValid() === TokenState.VALID ?
                            <div>
                                <MenuItem component={Link}
                                          to="/"
                                          onClick={
                                              () => {
                                                  auth.signout()
                                                  handleClose();
                                              }}>
                                    logout
                                </MenuItem>
                                <MenuItem
                                    component={Link}
                                    to="/user-profile-screen"
                                    onClick={handleClose}>
                                    my profile
                                </MenuItem>
                            </div>
                            :
                            <div>
                                <MenuItem
                                    component={Link}
                                    to="/login-screen"
                                    onClick={handleClose}>
                                    log in
                                </MenuItem>
                                <MenuItem
                                    component={Link}
                                    to="/register-screen"
                                    onClick={handleClose}>
                                    register
                                </MenuItem>
                            </div>
                        }
                    </Menu>
                </div>
            </Toolbar>
        </AppBar>
    );
}

export default MenuAppBar;
