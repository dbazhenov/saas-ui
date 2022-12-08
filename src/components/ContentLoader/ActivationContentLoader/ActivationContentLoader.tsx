import React from 'react';
import { useStyles } from '@grafana/ui';
import ContentLoader from 'react-content-loader';
import { getStyles } from './ActivationContentLoader.styles';

export const ActivationContentLoader = () => {
  const styles = useStyles(getStyles);

  return (
    <div className={styles.fullscreenWrapper}>
      <ContentLoader
        speed={3}
        backgroundColor={styles.colorLoader}
        foregroundColor={styles.backgroundLoader}
        className={styles.loaderSize}
        data-testid="dashboard-content-loader"
      >
        <rect x="0" y="86" rx="0" ry="0" width="380" height="32" />
        <rect x="0" y="112" rx="0" ry="0" width="200" height="40" />

        <rect x="0" y="195" rx="0" ry="0" width="1100" height="428" />
        <rect x="0" y="639" rx="0" ry="0" width="1100" height="37" />
      </ContentLoader>
    </div>
  );
};
