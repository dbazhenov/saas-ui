import { OrganizationMembersResponse, OrganizationResponse } from 'core/api/types';
import { Organization, OrgMember, PmmInstance } from 'store/types';

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
