import React, { FC } from 'react';
import { Button, CircularProgress } from '@mui/material';
import { useStyles } from 'core/utils';
import { Messages } from './ClusterDefaultStep.messages';
import { getStyles } from './ClusterDefaultStep.styles';
import { ClusterDefaultStepProps } from './ClusterDefaultStep.types';
import { CIRCULAR_SIZE } from '../DBaaS.constants';

export const ClusterDefaultStep: FC<ClusterDefaultStepProps> = ({ orgId, onClick, isClusterLoading }) => {
  const styles = useStyles(getStyles);

  return (
    <div data-testid="cluster-default">
      <div className={styles.defaultText}>{Messages.defaultMessage}</div>
      {isClusterLoading ? (
        <div data-testid="cluster-building-loader" className={styles.loader}>
          <CircularProgress color="inherit" size={CIRCULAR_SIZE} />
        </div>
      ) : (
        <Button data-testid="launch-cluster" variant="contained" disabled={orgId === ''} onClick={onClick}>
          {Messages.launchTempCluster}
        </Button>
      )}
    </div>
  );
};
