import React, { FC, useState } from 'react';
import { AppBar, Avatar, Box, IconButton, Menu, MenuItem, Toolbar, useTheme } from '@mui/material';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import NightlightOutlinedIcon from '@mui/icons-material/NightlightOutlined';
import PersonIcon from '@mui/icons-material/Person';
import { themeChangeAction } from 'store/theme';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Routes } from 'core';
import { logoutAction } from 'store/auth';
import { Messages } from './AppHeader.messages';
import { styles } from './AppHeader.styles';

export const AppHeader: FC = () => {
  const [profileAnchor, setProfileAnchor] = useState<null | HTMLElement>(null);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const { palette } = useTheme();
  const dispatch = useDispatch();

  const handleOpenPropfileMenu = (e: React.MouseEvent<HTMLElement>) => {
    setProfileAnchor(e.currentTarget);
    setProfileMenuOpen(true);
  };

  const handleCloseProfileMenu = () => setProfileMenuOpen(false);
  const handleLogOut = () => dispatch(logoutAction());
  const changeTheme = () => dispatch(themeChangeAction());

  return (
    <AppBar position="fixed" sx={styles.appBar} elevation={1}>
      <Toolbar>
        <Box display="flex" flexGrow={1} />
        <Box display="flex" flexGrow={0} alignItems="center" gap={4}>
          <IconButton onClick={changeTheme} data-testid="theme-switch">
            {palette.mode === 'light' ? <NightlightOutlinedIcon /> : <LightModeOutlinedIcon />}
          </IconButton>
          <IconButton onClick={handleOpenPropfileMenu} data-testid="menu-bar-profile-dropdown-toggle">
            <Avatar>
              <PersonIcon />
            </Avatar>
          </IconButton>
          <Menu
            anchorEl={profileAnchor}
            open={profileMenuOpen}
            onClose={handleCloseProfileMenu}
            data-testid="dropdown-menu-container"
            sx={styles.menu}
          >
            <MenuItem component={Link} to={Routes.profile} data-testid="menu-bar-profile-dropdown-profile">
              {Messages.profile}
            </MenuItem>
            <MenuItem onClick={handleLogOut} data-testid="menu-bar-profile-dropdown-logout">
              {Messages.logout}
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
