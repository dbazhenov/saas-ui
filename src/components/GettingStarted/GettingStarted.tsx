import React, { FC } from 'react';
import { useStyles } from '@grafana/ui';
import { getStyles } from './GettingStarted.styles';
import { GettingStartedPmmSection } from './GettingStartedPmmSection';
import { GettingStartedOrgSection } from './GettingStartedOrgSection';
import { Messages } from './GettingStarted.messages';

export const GettingStarted: FC = () => {
  const styles = useStyles(getStyles);

  return (
    <>
      <header className={styles.header}>{Messages.getStarted}</header>
      <div data-testid="getting-started-container" className={styles.container}>
        <GettingStartedOrgSection />
        <GettingStartedPmmSection />
      </div>
    </>
  );
};
