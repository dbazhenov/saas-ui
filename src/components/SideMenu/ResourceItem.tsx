import React, { FC } from 'react';
import { ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { NavItemProps } from './SideMenu.types';

export const ResourceItem: FC<NavItemProps> = ({ label, icon, to }) => (
  <ListItem disablePadding>
    <ListItemButton href={to} target="_blank">
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText>{label}</ListItemText>
    </ListItemButton>
  </ListItem>
);
