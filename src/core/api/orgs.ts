import { Api, ENDPOINTS } from 'core/api';
import {
  EditMemberPayload,
  RemoveMemberPayload,
  InviteMemberPayload,
  BulkInviteMembersPayload,
} from 'store/types';
import {
  BulkInviteOrgMembersResponse,
  CreateOrganizationResponse,
  EditOrganizationResponse,
  GetOrganizationResponse,
  RequestBody,
  SearchOrganizationEntitlementsResponse,
  SearchOrganizationInventoryResponse,
  SearchOrganizationMembersResponse,
  SearchOrganizationsResponse,
  SearchOrganizationTicketsResponse,
} from './types';

const { Org } = ENDPOINTS;

export const createOrganization = (name: string) =>
  Api.post<RequestBody, CreateOrganizationResponse>(Org.createOrganization, { name });

export const editOrganization = (orgId: string, name: string) =>
  Api.put<RequestBody, EditOrganizationResponse>(Org.editOrganization(orgId), { name });

export const getOrganization = (orgId: string) =>
  Api.get<RequestBody, GetOrganizationResponse>(Org.getOrganization(orgId));

export const createServiceNowOrganization = (name: string) =>
  Api.post<RequestBody, CreateOrganizationResponse>(Org.createServiceNowOrganization, { name });

export const searchOrgs = () => Api.post<RequestBody, SearchOrganizationsResponse>(Org.getUserOganizations);

export const searchOrgMembers = (orgId: string, username?: string) =>
  Api.post<RequestBody, SearchOrganizationMembersResponse>(
    Org.searchOrgMember(orgId),
    username ? { user: { username } } : undefined,
  );

export const searchOrgTickets = (orgId: string) =>
  Api.post<RequestBody, SearchOrganizationTicketsResponse>(Org.searchOrgTickets(orgId));

export const searchOrgInventory = (orgId: string) =>
  Api.post<RequestBody, SearchOrganizationInventoryResponse>(Org.searchOrgInventory(orgId));

export const removeOrgPmmInstance = (pmmInstanceId: string) =>
  Api.post<RequestBody, void>(Org.disconnectOrgPmmInstance(pmmInstanceId));

export const searchOrgEntitlements = (orgId: string) =>
  Api.post<RequestBody, SearchOrganizationEntitlementsResponse>(Org.searchOrgEntitlements(orgId));

export const inviteOrgMember = ({ orgId, username, role }: InviteMemberPayload) =>
  Api.post<RequestBody, void>(Org.inviteMember(orgId), { username, role, orgId });

export const bulkInviteOrgMembers = ({ orgId, users }: BulkInviteMembersPayload) =>
  Api.post<RequestBody, BulkInviteOrgMembersResponse>(Org.bulkInviteMembers(orgId), { users });

export const removeOrgMember = ({ orgId, memberId }: RemoveMemberPayload) =>
  Api.del<RequestBody, void>(Org.removeMember(orgId, memberId));

export const editOrgMember = ({ orgId, memberId, role }: EditMemberPayload) =>
  Api.put<RequestBody, void>(Org.editMember(orgId, memberId), { role });
