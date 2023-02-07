import React, { FC } from 'react';
import { Typography, Card } from '@mui/material';
import { useStyles } from 'core/utils';
import { getStyles } from './USPCard.styles';
import { USPCardProps } from './USPCard.types';

export const USPCard: FC<USPCardProps> = ({ icon, title, text }) => {
  const styles = useStyles(getStyles);

  return (
    <Card className={styles.card}>
      <div data-testid="uspcard-icon" className={styles.icon}>
        {React.createElement(icon)}
      </div>
      <Typography data-testid="uspcard-title" variant="h6">
        {title}
      </Typography>
      <p data-testid="uspcard-text">{text}</p>
    </Card>
  );
};
