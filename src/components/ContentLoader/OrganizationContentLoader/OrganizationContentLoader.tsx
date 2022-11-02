import { useStyles } from '@grafana/ui';
import React from 'react';
import ContentLoader from 'react-content-loader';
import { getStyles } from './OrganizationContentLoader.styles';

export const OrganizationContentLoader = () => {
  const styles = useStyles(getStyles);

  return (
    <ContentLoader
      speed={3}
      backgroundColor={styles.colorLoader}
      foregroundColor={styles.backgroundLoader}
      className={styles.loaderSize}
      data-testid="organization-content-loader"
    >
      <rect x="0" y="15" rx="0" ry="0" width="90" height="25" />
      <rect x="120" y="15" rx="0" ry="0" width="90" height="25" />
      <rect x="0" y="70" rx="0" ry="0" width="1720" height="300" />
    </ContentLoader>
  );
};
