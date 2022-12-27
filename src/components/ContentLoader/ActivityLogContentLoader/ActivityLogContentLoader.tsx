import { useStyles } from '@grafana/ui';
import React from 'react';
import ContentLoader from 'react-content-loader';
import { getStyles } from './ActivityLogContentLoader.styles';

export const ActivityLogContentLoader = () => {
  const styles = useStyles(getStyles);

  return (
    <ContentLoader
      speed={3}
      backgroundColor={styles.colorLoader}
      foregroundColor={styles.backgroundLoader}
      className={styles.loaderSize}
      height={265}
      data-testid="activity-log-content-loader"
    >
      <rect x="0" y="0" rx="0" ry="0" width="1720" height="25" />
      <rect x="0" y="30" rx="0" ry="0" width="1720" height="25" />
      <rect x="0" y="60" rx="0" ry="0" width="1720" height="25" />
      <rect x="0" y="90" rx="0" ry="0" width="1720" height="25" />
      <rect x="0" y="120" rx="0" ry="0" width="1720" height="25" />
      <rect x="0" y="150" rx="0" ry="0" width="1720" height="25" />
      <rect x="0" y="180" rx="0" ry="0" width="1720" height="25" />
      <rect x="0" y="210" rx="0" ry="0" width="1720" height="25" />
      <rect x="0" y="240" rx="0" ry="0" width="1720" height="25" />
    </ContentLoader>
  );
};
