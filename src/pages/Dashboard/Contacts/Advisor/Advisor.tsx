import React, { FC } from 'react';
import { Icon, useStyles } from '@grafana/ui';
import { AdvisorProps } from './Advisor.types';
import { getStyles } from './Advisor.styles';

export const Advisor: FC<AdvisorProps> = ({ label, hasAdvisor }) => {
  const styles = useStyles(getStyles);

  return (
    <div className={styles.wrapper} data-testid="advisor-wrapper">
      <p className={styles.label}>{label}</p>
      {hasAdvisor ? 
        <Icon data-testid="advisor-check-icon" name="check" className={styles.checkIcon} /> :
        <Icon data-testid="advisor-times-icon" name="times" className={styles.timesIcon} />}
    </div>
  );
};
