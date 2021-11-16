import React, { FC } from 'react';
import { useStyles } from '@grafana/ui';
import { NavLink } from 'react-router-dom';
import { SidebarItem } from 'components/SidebarItem';
import { getStyles } from './IconLink.styles';
import { IconLinkProps } from './IconLink.types';

export const IconLink: FC<IconLinkProps> = ({ alt, children, icon, to }) => {
  const styles = useStyles(getStyles);

  return (
    <NavLink exact to={to} data-testid="nav-link" activeClassName={styles.linkActive} className={styles.link}>
      <SidebarItem alt={alt} icon={icon}>
        {children}
      </SidebarItem>
    </NavLink>
  );
};
