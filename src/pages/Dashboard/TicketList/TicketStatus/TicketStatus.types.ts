import { OrgTicketStatus } from 'core/api/types';

export interface TicketStatusProps {
  status: OrgTicketStatus;
}

export type StatusMap = {
  [key in OrgTicketStatus]?: {
    color?: string;
    icon?: string;
    label: string;
  };
};
