import React, { FC } from 'react';
import { useStyles } from 'core/utils';
import { Typography } from '@mui/material';
import { getStyles } from './GettingStarted.styles';
import { GettingStartedPmmSection } from './GettingStartedPmmSection';
import { GettingStartedOrgSection } from './GettingStartedOrgSection';
import { Messages } from './GettingStarted.messages';

export const GettingStarted: FC = () => {
  const styles = useStyles(getStyles);

  return (
    <>
      <Typography variant="h5" className={styles.header}>
        {Messages.getStarted}
      </Typography>
      <div data-testid="getting-started-container" className={styles.container}>
        <GettingStartedOrgSection />
        <GettingStartedPmmSection />
      </div>
    </>
  );
};
