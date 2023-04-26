import {
  OrganizationMembersResponse,
  OrganizationResponse,
  BulkInviteOrgMembersResponseUsers,
} from 'core/api/types';
import { BulkInviteFormFields, MemberRole } from 'pages/ManageOrganization/ManageOrganization.types';
import { BulkInviteMembersPayload, Organization, OrgMember, PmmInstance } from 'store/types';
import { ROLES } from 'pages/ManageOrganization/ManageOrganization.constants';

export interface PmmInstanceResponse {
  pmm_server_id: string;
  pmm_server_name: string;
  pmm_server_url: string;
}

export const transformInventory = (inventory: PmmInstanceResponse[]): PmmInstance[] =>
  inventory.map((pmmInstance) => ({
    id: pmmInstance.pmm_server_id,
    name: pmmInstance.pmm_server_name,
    url: pmmInstance.pmm_server_url,
  }));

export const transformOrganizations = (orgs: OrganizationResponse[]): Organization[] =>
  orgs.map((org) => ({
    id: org.id,
    name: org.name,
    createdAt: org.created_at,
    updatedAt: org.updated_at,
    tier: org.tier,
  }));

export const transformOrgMembers = (members: OrganizationMembersResponse[]): OrgMember[] =>
  members.map((member) => ({
    email: member.username,
    firstName: member.first_name,
    lastName: member.last_name,
    memberId: member.member_id,
    role: member.role,
    status: member.status,
  }));

export const transformBulkInvitedUsers = (
  users: BulkInviteOrgMembersResponseUsers[],
  payload: BulkInviteMembersPayload,
): BulkInviteFormFields[] => {
  if (users.length) {
    return users.map((user) => ({
      username: user.username,
      role: users.length
        ? ROLES.find(
            (role) =>
              role.value ===
              payload.users.find((plUser: { username: string }) => plUser.username === user.username)?.role!,
          )!.value
        : ROLES.find((role) => role.value === MemberRole.technical)!.value,
      error: user.error,
    }));
  }

  return [
    {
      username: '',
      role: ROLES.find((role) => role.value === MemberRole.technical)!.value,
      error: '',
    },
  ];
};
