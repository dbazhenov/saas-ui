import React, { FC } from 'react';
import { Icon, useStyles } from '@grafana/ui';
import { AdvisorProps } from './Advisor.types';
import { getStyles } from './Advisor.styles';

export const Advisor: FC<AdvisorProps> = ({ label, hasAvisor }) => {
  const styles = useStyles(getStyles);

  return (
    <div className={styles.wrapper} data-testid="advisor-wrapper">
      <p className={styles.label}>{label}</p>
      {hasAvisor ? 
        <Icon data-testid="advisor-check-icon" name="check" className={styles.checkIcon} /> :
        <Icon data-testid="advisor-times-icon" name="times" className={styles.timesIcon} />}
    </div>
  );
};
