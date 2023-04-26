import React, { FC } from 'react';
import { Routes, useStyles } from 'core';
import { ReactComponent as AdvisorsWidget } from 'assets/advisors-widget.svg';
import { Button, Card } from '@mui/material';
import { useHistory } from 'react-router-dom';
import { getStyles } from './AdvisorsInfo.styles';
import { Messages } from './AdvisorsInfo.messages';

export const AdvisorsInfo: FC = () => {
  const styles = useStyles(getStyles);
  const history = useHistory();

  return (
    <Card className={styles.advisorsInfo}>
      <div className={styles.title}>Advisors</div>
      <div className={styles.imageWrapper}>
        <AdvisorsWidget className={styles.advisorsWidgetImg} />
      </div>
      <div className={styles.description}>{Messages.description}</div>
      <Button
        variant="outlined"
        onClick={() => history.push(Routes.advisors)}
        className={styles.goToAdvisors}
      >
        {Messages.goToAdvisors}
      </Button>
    </Card>
  );
};
