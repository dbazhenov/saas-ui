import React, { FC } from 'react';
import { useStyles } from '@grafana/ui';
import { IconLink } from 'components';
import { Routes } from 'core/routes';
import dotCircle from 'assets/dot-circle.svg';
import dashboard from 'assets/dashboard.svg';
import sidebarBlog from 'assets/percona-sidebar-blog.svg';
import sidebarDocs from 'assets/percona-sidebar-docs.svg';
import sidebarForum from 'assets/percona-sidebar-forum.svg';
import { ResourceLink } from 'components/ResourceLink';
import { getStyles } from './SideMenu.styles';
import { Messages } from './SideMenu.messages';
import { resourcesLinks } from './SideMenu.constants';

export const SideMenu: FC = () => {
  const styles = useStyles(getStyles);

  return (
    <nav data-testid="side-menu" className={styles.sideMenu}>
      <section data-testid="side-menu-main-section" className={styles.section}>
        <header className={styles.navSectionLabel}>{Messages.main}</header>
        <IconLink
          icon={dotCircle}
          to={Routes.root}
          alt={Messages.gettingStarted}
        >
          {Messages.gettingStarted}
        </IconLink>
        <IconLink
          icon={dashboard}
          to={Routes.dashboard}
          alt={Messages.dashboard}
        >
          {Messages.dashboard}
        </IconLink>
      </section>
      <section data-testid="side-menu-resources-section" className={styles.section}>
        <header className={styles.navSectionLabel}>{Messages.resources}</header>
          <ResourceLink
            text={Messages.documentation}
            icon={sidebarDocs}
            href={resourcesLinks.documentation}
          />
          <ResourceLink text={Messages.blogs} icon={sidebarBlog} href={resourcesLinks.blogs} />
          <ResourceLink text={Messages.forum} icon={sidebarForum} href={resourcesLinks.forum} />
      </section>
    </nav>
  );
};
