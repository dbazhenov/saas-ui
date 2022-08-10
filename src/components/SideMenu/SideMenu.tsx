import React, { FC } from 'react';
import { useStyles } from '@grafana/ui';
import { IconLink } from 'components';
import { Routes } from 'core/routes';
import dashboard from 'assets/dashboard.svg';
import organization from 'assets/percona-sidebar-organization.svg';
import instances from 'assets/percona-sidebar-instances.svg';
import sidebarBlog from 'assets/percona-sidebar-blog.svg';
import sidebarDocs from 'assets/percona-sidebar-docs.svg';
import sidebarForum from 'assets/percona-sidebar-forum.svg';
import help from 'assets/percona-sidebar-help.svg';
import { ResourceLink } from 'components/ResourceLink';
import { getStyles } from './SideMenu.styles';
import { Messages } from './SideMenu.messages';
import { resourcesLinks } from './SideMenu.constants';

export const SideMenu: FC = () => {
  const styles = useStyles(getStyles);

  return (
    <nav data-testid="side-menu" className={styles.sideMenu}>
      <section data-testid="side-menu-main-section" className={styles.section}>
        <header className={styles.navSectionLabel} data-testid="main-header">
          {Messages.main}
        </header>
        <IconLink icon={dashboard} to={Routes.root} alt={Messages.dashboard}>
          {Messages.dashboard}
        </IconLink>
        <IconLink icon={organization} to={Routes.organization} alt={Messages.organization}>
          {Messages.organization}
        </IconLink>
        <IconLink icon={instances} to={Routes.instances} alt={Messages.instances}>
          {Messages.instances}
        </IconLink>
      </section>
      <section data-testid="side-menu-resources-section" className={styles.section}>
        <header className={styles.navSectionLabel} data-testid="resources-header">
          {Messages.resources}
        </header>
        <ResourceLink text={Messages.documentation} icon={sidebarDocs} href={resourcesLinks.documentation} />
        <ResourceLink text={Messages.blogs} icon={sidebarBlog} href={resourcesLinks.blogs} />
        <ResourceLink text={Messages.forum} icon={sidebarForum} href={resourcesLinks.forum} />
        <ResourceLink text={Messages.help} icon={help} href={resourcesLinks.help} />
      </section>
    </nav>
  );
};
