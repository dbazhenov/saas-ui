import React, { FC } from 'react';
import Alert from '@mui/material/Alert';
import { useStyles } from 'core';
import { Button, CircularProgress } from '@mui/material';
import { Messages } from './ClusterCreationFailed.messages';
import { getStyles } from './ClusterCreationFailed.styles';
import { CIRCULAR_SIZE } from '../DBaaS.constants';
import { ClusterCreationFailedProps } from './ClusterCreationFailed.types';

export const ClusterCreationFailed: FC<ClusterCreationFailedProps> = ({ onClick, isClusterLoading }) => {
  const styles = useStyles(getStyles);

  return (
    <div data-testid="cluster-failed">
      <Alert severity="error" className={styles.defaultText}>
        {Messages.errorMessage}
      </Alert>
      {isClusterLoading ? (
        <div data-testid="cluster-building-loader" className={styles.loader}>
          <CircularProgress color="inherit" size={CIRCULAR_SIZE} />
        </div>
      ) : (
        <Button variant="contained" onClick={onClick}>
          {Messages.retry}
        </Button>
      )}
    </div>
  );
};
