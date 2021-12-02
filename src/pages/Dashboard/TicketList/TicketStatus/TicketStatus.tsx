import React, { FC } from 'react';
import { useTheme } from '@grafana/ui';
import { TicketStatusProps } from './TicketStatus.types';
import { getStyles } from './TicketStatus.styles';

export const TicketStatus: FC<TicketStatusProps> = ({ status }: TicketStatusProps) => {
  const theme = useTheme();
  const styles = getStyles(theme, status);

  return <span className={styles.status}><i className="fa fa-dot-circle-o" /> {status}</span>;
};
