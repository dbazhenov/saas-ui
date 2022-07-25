import React, { FC } from 'react';
import { useTheme } from '@grafana/ui';
import { StatusMap, TicketStatusProps } from './TicketStatus.types';
import { getStyles } from './TicketStatus.styles';

const statusMap: StatusMap = {
  Open: {
    icon: 'fa fa-dot-circle-o',
    label: 'Open',
  },
  'Pending - Awaiting Customer': {
    icon: '',
    label: 'Pending - Awaiting Customer',
  },
  New: {
    icon: '',
    label: 'New',
  },
  Scheduled: {
    icon: '',
    label: 'Scheduled',
  },
  Authorize: {
    icon: '',
    label: 'Authorize',
  },
};

export const TicketStatus: FC<TicketStatusProps> = ({ status }: TicketStatusProps) => {
  const theme = useTheme();
  const styles = getStyles(theme, status);

  return (
    <span className={styles.status}>
      <i className={statusMap[status]?.icon} /> {statusMap[status]?.label}
    </span>
  );
};
