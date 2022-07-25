import { OrgTicketStatus } from 'core/api/types';

export interface TicketStatusProps {
  status: OrgTicketStatus;
}

export type StatusMap = {
  [key in OrgTicketStatus]?: {
    icon?: string;
    label?: string;
  };
};
