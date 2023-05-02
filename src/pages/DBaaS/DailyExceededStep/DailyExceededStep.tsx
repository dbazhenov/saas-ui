import React, { FC } from 'react';
import { useStyles } from 'core';
import { Button } from '@mui/material';
import { getStyles } from './DailyExceededStep.styles';
import { Messages } from './DailyExceededStep.messages';

export const DailyExceededStep: FC = () => {
  const styles = useStyles(getStyles);

  return (
    <div data-testid="daily-exceeded-step">
      <div className={styles.title}>{Messages.title}</div>
      <div className={styles.defaultText}>{Messages.defaultMessage}</div>
      <Button variant="contained" disabled>
        {Messages.launchTempCluster}
      </Button>
    </div>
  );
};
