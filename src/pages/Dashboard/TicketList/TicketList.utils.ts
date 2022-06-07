import { OrganizationTicketsResponse } from 'core/api/types';
import { OrgTicket } from './TicketList.types';

export const mapOrgTickets = (tickets: OrganizationTicketsResponse[]): OrgTicket[] =>
  tickets.map(
    ({
      number,
      short_description: description,
      priority,
      create_time: date,
      department,
      requester,
      task_type: taskType,
      url,
      state: status,
    }) => ({
      number,
      description,
      priority,
      date,
      department,
      requester,
      taskType,
      url,
      status,
    }),
  );
