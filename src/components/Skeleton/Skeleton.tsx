import React, { FC } from 'react';
import { useStyles } from '@grafana/ui';
import { getStyles } from './Skeleton.styles';

interface ISkeleton {
  width?: string | number;
  height?: string | number;
}

export const Skeleton: FC<ISkeleton> = ({ width, height }) => {
  const styles = useStyles(getStyles);

  return <div className={styles.skeleton} style={{ width, height }} data-testid="skeleton-loader" />;
};
