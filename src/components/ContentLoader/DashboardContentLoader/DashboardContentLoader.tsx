import { useStyles } from '@grafana/ui';
import React from 'react';
import ContentLoader from 'react-content-loader';
import { getStyles } from './DashboardContentLoader.styles';

export const DashBoardContentLoader = () => {
  const styles = useStyles(getStyles);

  return (
    <ContentLoader
      speed={3}
      backgroundColor={styles.colorLoader}
      foregroundColor={styles.backgroundLoader}
      className={styles.loaderSize}
      data-testid="dashboard-content-loader"
    >
      <rect x="0" y="0" rx="0" ry="0" width="1100" height="220" />
      <rect x="1125" y="0" rx="0" ry="0" width="620" height="220" />

      <rect x="0" y="340" rx="0" ry="0" width="200" height="22" />
      <rect x="0" y="400" rx="0" ry="0" width="1745" height="220" />

      <rect x="0" y="660" rx="0" ry="0" width="300" height="22" />
      <rect x="1600" y="660" rx="0" ry="0" width="200" height="22" />

      <rect x="0" y="715" rx="0" ry="0" width="1745" height="220" />
    </ContentLoader>
  );
};
