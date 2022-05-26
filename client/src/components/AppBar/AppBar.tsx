import * as React from 'react';
import {useLocation, useNavigate, Link} from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Menu from '@mui/material/Menu';
import { useAuth } from '../../auth/AuthProvider';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
// @ts-ignore
import logo from '@assets/images/TeamTableLogo.png'

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
    console.log('nop');
    navigate("/", { replace: true });
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" style={{ background: 'white' }}>
        <Toolbar>
          <Box sx={{ flexGrow: 1 }}>       
              <Box
                  component="img"
                  sx={{
                    height: 64,
                  }}
                  alt="logo"
                  src={logo}
                  onClick={navigateHome}
                />
              </Box>
          <div>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}>
              <AccountCircle />
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
              {auth?.loggedInUser ?
                <MenuItem  component={Link}
                           to="/"
                           onClick={
                  () => {
                    auth.signout()
                    handleClose();
                  }}>
                  logout
                </MenuItem>
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
    </Box>
  );
}

export default MenuAppBar;
