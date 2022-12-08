import React, { FC } from 'react';
import { useStyles } from 'core';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { AdvisorProps } from './Advisor.types';
import { getStyles } from './Advisor.styles';

export const Advisor: FC<AdvisorProps> = ({ label, hasAdvisor }) => {
  const styles = useStyles(getStyles);

  return (
    <div className={styles.wrapper} data-testid="advisor-wrapper">
      <p className={styles.label}>{label}</p>
      {hasAdvisor ? (
        <CheckOutlinedIcon data-testid="advisor-check-icon" className={styles.checkIcon} />
      ) : (
        <CloseOutlinedIcon data-testid="advisor-times-icon" className={styles.timesIcon} />
      )}
    </div>
  );
};
