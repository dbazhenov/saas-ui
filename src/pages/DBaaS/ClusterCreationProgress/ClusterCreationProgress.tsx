import React, { FC } from 'react';
import { LinearProgress } from '@mui/material';
import { useStyles } from 'core';
import { getStyles } from './ClusterCreationProgress.styles';
import { PROGRESS_STATUSES_SEQUENCE } from './ClusterCreationProgress.constants';
import { ClusterCreationProgressProps } from './ClusterCreationProgress.types';
import { Messages } from './ClusterCreationProgress.message';

export const ClusterCreationProgress: FC<ClusterCreationProgressProps> = ({ status }) => {
  const styles = useStyles(getStyles);

  const value = ((PROGRESS_STATUSES_SEQUENCE.indexOf(status) + 1) / PROGRESS_STATUSES_SEQUENCE.length) * 100;
  const isDeterminate = PROGRESS_STATUSES_SEQUENCE.includes(status);

  return (
    <div data-testid="cluster-progress" className={styles.content}>
      <section className={styles.mainSection}>
        <div>{Messages.mainText1}</div>
        <div>{Messages.mainText2}</div>
      </section>
      <LinearProgress variant={isDeterminate ? 'determinate' : undefined} value={value} />
      <div className={styles.progressDetails}>{Messages.progressDetails}</div>
    </div>
  );
};
