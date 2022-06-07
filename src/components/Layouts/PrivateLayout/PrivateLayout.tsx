import React, { FC } from 'react';
import { useStyles } from '@grafana/ui';
import { MenuBar, SideMenu } from 'components';
import { getStyles } from './PrivateLayout.styles';

export const PrivateLayout: FC = ({ children }) => {
  const styles = useStyles(getStyles);

  return (
    <main className={styles.main}>
      <MenuBar />
      <div className={styles.mainWrapper}>
        <SideMenu />
        <section className={styles.contentWrapper}>{children}</section>
      </div>
    </main>
  );
};
