import { Api, ENDPOINTS } from 'core/api';
import { RequestBody, SearchOrganizationMembersResponse, SearchOrganizationsResponse, SearchOrganizationTicketsResponse, SearchOrganizationInventoryResponse } from './types';

const { Org } = ENDPOINTS;

export const searchOrgs = () => Api
  .post<RequestBody, SearchOrganizationsResponse>(Org.getUserOganizations);

export const searchOrgMembers = (orgId: string, username?: string) => Api
  .post<RequestBody, SearchOrganizationMembersResponse>(
    Org.searchOrgMember(orgId), username ? { user: { username } } : undefined,
  );

export const searchOrgTickets = (orgId: string) => Api
  .post<RequestBody, SearchOrganizationTicketsResponse>(Org.searchOrgTickets(orgId));

export const searchOrgInventory = (orgId: string) => Api
  .post<RequestBody, SearchOrganizationInventoryResponse>(Org.searchOrgInventory(orgId));
