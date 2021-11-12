import { Api, ENDPOINTS } from 'core/api';
import { RequestBody, SearchOrganizationMembersResponse, SearchOrganizationsResponse } from './types';

const { Org } = ENDPOINTS;

export const searchOrgs = () => Api
  .post<RequestBody, SearchOrganizationsResponse>(Org.getUserOganizations);

export const searchOrgMembers = (orgId: string, username?: string) => Api
  .post<RequestBody, SearchOrganizationMembersResponse>(
    Org.searchOrgMember(orgId), username ? { user: { username } } : undefined,
  );
