import { OrgTicketStatus } from 'core/api/types';

export interface OrgTicket {
  number: string;
  description: string;
  priority: string;
  date: string;
  department: string;
  requester: string;
  taskType: string;
  url: string
  status: OrgTicketStatus;
}
