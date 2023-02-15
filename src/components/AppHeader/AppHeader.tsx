import React, { FC, useState } from 'react';
import {
  AppBar,
  Avatar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Divider,
  useTheme,
  Switch,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import { themeChangeAction } from 'store/theme';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Routes } from 'core';
import { getAuth, logoutAction } from 'store/auth';
import { useStyles } from 'core/utils';
import { Messages } from './AppHeader.messages';
import { getStyles } from './AppHeader.styles';

export const AppHeader: FC = () => {
  const [profileAnchor, setProfileAnchor] = useState<null | HTMLElement>(null);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const { email, firstName, lastName } = useSelector(getAuth);
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const styles = useStyles(getStyles);

  const handleOpenPropfileMenu = (e: React.MouseEvent<HTMLElement>) => {
    setProfileAnchor(e.currentTarget);
    setProfileMenuOpen(true);
  };

  const handleCloseProfileMenu = () => setProfileMenuOpen(false);
  const handleLogOut = () => dispatch(logoutAction());
  const changeTheme = () => dispatch(themeChangeAction());

  return (
    <AppBar position="fixed" className={styles.appBar} elevation={1}>
      <Toolbar>
        <Box display="flex" flexGrow={1} />
        <Box display="flex" flexGrow={0} alignItems="center" gap={4}>
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
            className={styles.menu}
            MenuListProps={{ className: styles.menuList }}
          >
            {firstName || lastName ? (
              <MenuItem
                data-testid="menu-bar-profile-dropdown-name"
                disableRipple
                className={styles.userDataText}
              >
                {firstName} {lastName}
              </MenuItem>
            ) : null}
            <MenuItem
              data-testid="menu-bar-profile-dropdown-email"
              disableRipple
              className={styles.userDataText}
            >
              {email}
            </MenuItem>
            <Divider />
            <MenuItem
              className={styles.switch}
              data-testid="menu-bar-profile-dropdown-darkmode"
              disableRipple
            >
              {Messages.mode}
              <Switch
                checked={!(palette.mode === 'light')}
                color="primary"
                onChange={changeTheme}
                data-testid="theme-switch"
              />
            </MenuItem>
            <MenuItem component={Link} to={Routes.profile} data-testid="menu-bar-profile-dropdown-profile">
              {Messages.profile}
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogOut} data-testid="menu-bar-profile-dropdown-logout">
              {Messages.logout}
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
