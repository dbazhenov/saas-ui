import React, { FC } from 'react';
import { useTheme } from '@mui/material';
import { StatusMap, TicketStatusProps } from './TicketStatus.types';
import { getStyles } from './TicketStatus.styles';

export const TicketStatus: FC<TicketStatusProps> = ({ status }: TicketStatusProps) => {
  const theme = useTheme();
  const styles = getStyles(theme, status);

  const statusMap: StatusMap = {
    Open: {
      icon: 'fa fa-dot-circle-o',
      label: 'Open',
    },
    'Pending - Awaiting Customer': {
      icon: 'fa fa-clock-o',
      label: 'Pending - Awaiting Customer',
    },
    New: {
      icon: 'fa fa-plus-circle',
      label: 'New',
    },
    Scheduled: {
      icon: 'fa fa-calendar-o',
      label: 'Scheduled',
    },
    Authorize: {
      icon: 'fa fa-check-circle',
      label: 'Authorize',
    },
  };

  return (
    <span className={styles.status}>
      <i className={statusMap[status]?.icon} /> {statusMap[status]?.label}
    </span>
  );
};
