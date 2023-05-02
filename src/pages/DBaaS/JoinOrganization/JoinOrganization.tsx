import React, { FC } from 'react';
import { Card, Link } from '@mui/material';
import { useStyles } from 'core/utils';
import { Routes } from 'core';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { Link as RouterLink } from 'react-router-dom';
import { Messages } from './JoinOrganization.messages';
import { getStyles } from './JoinOrganization.styles';

export const JoinOrganization: FC = () => {
  const styles = useStyles(getStyles);

  return (
    <div className={styles.joinOrg}>
      <div className={styles.wrapper}>
        <Card data-testid="cluster-default" className={styles.card}>
          <div className={styles.text}>
            <div className={styles.warningMessage}>
              <WarningAmberIcon fontSize="small" className={styles.warningIcon} />
              <div className={styles.title}>{Messages.joinOrgTitle}</div>
            </div>
            <div className={styles.description}>{Messages.joinOrgDesc}</div>
          </div>
          <Link underline="none" className={styles.link} component={RouterLink} to={Routes.organization}>
            {Messages.manageAccount}
          </Link>
        </Card>
      </div>
    </div>
  );
};
