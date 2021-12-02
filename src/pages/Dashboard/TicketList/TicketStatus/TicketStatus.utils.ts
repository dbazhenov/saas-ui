import { GrafanaTheme } from '@grafana/data';
import { OrgTicketStatus } from 'core/api/types';

export const getColor = ({ colors, palette }: GrafanaTheme, status: OrgTicketStatus) => {

  if (status === OrgTicketStatus.Open || status === OrgTicketStatus.Resolved) {
    return palette.greenBase;
  }

  if (status === OrgTicketStatus.Closed) {
    return palette.red;
  }

  return colors.textStrong;
};
