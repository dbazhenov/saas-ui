import { searchOrgs, searchOrgTickets } from 'core/api/orgs';
import { OrgTicket } from './TicketList.types';
import { mapOrgTickets } from './TicketList.utils';

export const getTickets = async(): Promise<OrgTicket[]> => {
  const { data: orgData = { orgs: [] } } = await searchOrgs();
  const { id } = orgData.orgs[0] || [{ id: '' }];
  const { data: ticketData = { tickets: [] } } = await searchOrgTickets(id);

  return mapOrgTickets(ticketData.tickets);
};
