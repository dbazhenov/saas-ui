import { GetOrganizationResponse, OrganizationEntitlement } from 'core/api/types';
import { OrgTicket } from 'pages/Dashboard/TicketList/TicketList.types';
import { MemberRole, MemberStatus } from 'pages/ManageOrganization/ManageOrganization.types';

export interface PmmInstance {
  id: string;
  name: string;
  url: string;
}

export interface Organization {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
}

export interface OrgMember {
  memberId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: MemberRole;
  status: MemberStatus;
}

export enum OrganizationViewTabs {
  organization = 'Organization',
  members = 'Members',
}

type OrganizationInfo = GetOrganizationResponse;
export interface OrgsState {
  entitlements: OrganizationEntitlement[];
  inventory: PmmInstance[] | null;
  isOrgFromPortal: boolean;
  currentOrg: OrganizationInfo;
  orgs: Organization[];
  members: OrgMember[];
  tickets: {
    list: OrgTicket[];
    pending: boolean;
  };
  pending: boolean;
  editing: boolean;
  viewActiveTab: OrganizationViewTabs;
  orgDetailsSeen: boolean;
}

export interface InviteMemberPayload {
  orgId: string;
  role: string;
  username: string;
}

export interface RemoveMemberPayload {
  orgId: string;
  memberId: string;
}

export interface EditMemberPayload {
  orgId: string;
  memberId: string;
  role: string;
}
