import React, { FC } from 'react';
import { Link } from '@mui/material';
import { FooterMenuItemProps } from './FooterMenuItem.types';

export const FooterMenuItem: FC<FooterMenuItemProps> = ({ href, children }) => (
  <Link
    data-testid={`${children}-footer-menu-item`}
    color="inherit"
    underline="none"
    variant="body2"
    href={href}
    target="_blank"
  >
    {children}
  </Link>
);
