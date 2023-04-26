import React, { FC } from 'react';
import { Card, Link } from '@mui/material';
import { useStyles } from 'core/utils';
import { Routes } from 'core';
import { WarningAmber } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { getStyles } from './WarningAlert.styles';
import { AlertCardProps } from './WarningAlert.types';

export const WarningAlert: FC<AlertCardProps> = ({ title, description, linkTitle }) => {
  const styles = useStyles(getStyles);

  return (
    <Card data-testid="cluster-default" className={styles.card}>
      <div className={styles.text}>
        <div className={styles.warningMessage}>
          <WarningAmber fontSize="small" className={styles.warningIcon} />
          {title}
        </div>
        <div className={styles.description}>{description}</div>
      </div>
      <Link underline="none" className={styles.link} component={RouterLink} to={Routes.organization}>
        {linkTitle}
      </Link>
    </Card>
  );
};
