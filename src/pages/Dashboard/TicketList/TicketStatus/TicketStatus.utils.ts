import { Theme } from '@mui/material';
import { OrgTicketStatus } from 'core/api/types';

export const getColor = ({ palette }: Theme, status: OrgTicketStatus) => {
  if (status === OrgTicketStatus.Open || status === OrgTicketStatus.New) {
    return palette.success.main;
  }

  return palette.text.primary;
};
