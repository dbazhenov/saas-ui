import { Icon, useStyles } from '@grafana/ui';
import { SidebarItem } from 'components/SidebarItem';
import React, { FC } from 'react';
import { ResourceLinkProps } from './ResourceLink.types';
import { getStyles } from './ResourceLink.styles';

export const ResourceLink: FC<ResourceLinkProps> = ({ text, href, icon }) => {
  const styles = useStyles(getStyles);

  return (
    <a href={href} target="_blank" rel="noreferrer noopener" className={styles.link}>
      <SidebarItem alt={text} icon={icon}>
        {text}
        <Icon name="external-link-alt" className={styles.icon} />
      </SidebarItem>
    </a>
  );
};
