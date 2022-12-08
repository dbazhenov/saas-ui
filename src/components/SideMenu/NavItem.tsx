import React, { FC } from 'react';
import { useHistory } from 'react-router-dom';
import { ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { NavItemProps } from './SideMenu.types';

export const NavItem: FC<NavItemProps> = ({ label, icon, to }) => {
  const history = useHistory();
  const isSelected = history.location.pathname === to;

  return (
    <ListItem disablePadding>
      <ListItemButton selected={isSelected} onClick={() => history.push(to)}>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText>{label}</ListItemText>
      </ListItemButton>
    </ListItem>
  );
};
