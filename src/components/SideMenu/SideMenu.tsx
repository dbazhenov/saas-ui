import React, { FC } from 'react';
import { Box, createTheme, Drawer, List, ThemeProvider, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { ReactComponent as PerconaLogo } from 'assets/percona-logo.svg';
import { HEADER_HEIGHT } from 'components/Layouts/PrivateLayout/PrivateLayout.constants';
import { Routes } from 'core';
import { Messages } from './SideMenu.messages';
import { mainMenu, resourcesMenu } from './SideMenu.constants';
import { styles } from './SideMenu.styles';
import { NavItem } from './NavItem';
import { ResourceItem } from './ResourceItem';

const sideMenuTheme = createTheme({ palette: { mode: 'dark' } });

export const SideMenu: FC = () => (
  <ThemeProvider theme={sideMenuTheme}>
    <Drawer variant="permanent" data-testid="side-menu" sx={styles.drawer}>
      <Box display="flex" flexDirection="column" pb={2} flexGrow={1}>
        <Box
          display="flex"
          flexDirection="row"
          alignItems="center"
          pl={2}
          mb={2}
          height={`${HEADER_HEIGHT}px`}
          color="inherit"
          component={Link}
          sx={styles.logo.wrapper}
          to={Routes.root}
          data-testid="menu-bar-home-link"
        >
          <PerconaLogo />
          <Typography
            marginLeft={1}
            marginTop="3px"
            fontWeight={500}
            fontSize={16}
            sx={styles.logo.typography}
          >
            {Messages.portal}
          </Typography>
        </Box>
        <List data-testid="side-menu-main-section">
          {mainMenu.map((page) => (
            <NavItem key={page.to} label={page.label} icon={page.icon} to={page.to} />
          ))}
        </List>
        <Box flexGrow={1} />
        <List data-testid="side-menu-resources-section">
          {resourcesMenu.map((page) => (
            <ResourceItem key={page.to} label={page.label} icon={page.icon} to={page.to} />
          ))}
        </List>
      </Box>
    </Drawer>
  </ThemeProvider>
);
