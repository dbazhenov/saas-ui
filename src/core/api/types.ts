import { MemberRole, MemberStatus } from 'pages/ManageOrganization/ManageOrganization.types';
import { AxiosRequestConfig } from 'axios';

export interface RequestBody {
  [key: string]: any;
}

export interface RequestErrorData {
  code: number;
  error: string;
  message: string;
  details: any[];
}

// We could use AxiosResponse here, but the types are not complete there
export interface AxiosErrorResponse {
  headers: Headers;
  config: AxiosRequestConfig;
  data: RequestErrorData;
  request: XMLHttpRequest;
  status: number;
  statusText: string;
}

export interface GetProfileResponse {
  email: string;
  first_name: string;
  last_name: string;
}

export interface UpdateProfileRequest {
  firstName: string;
  lastName: string;
}

export interface ResetPasswordRequest {
  email: string;
}

export interface OrganizationResponse {
  id: string;
  name: string;
  created_at: number;
  updated_at: number;
}

export interface SearchOrganizationsResponse {
  orgs: OrganizationResponse[];
}

export interface OrganizationMembersResponse {
  first_name: string;
  last_name: string;
  member_id: string;
  role: MemberRole;
  status: MemberStatus;
  username: string;
}

export interface SearchOrganizationMembersResponse {
  members: OrganizationMembersResponse[];
}

export enum OrgTicketStatus {
  Open = 'Open',
  Closed = 'Closed',
  Resolved = 'Resolved',
  Pending = 'Pending - Awaiting Customer',
  Scheduled = 'Scheduled',
  New = 'New',
  Authorize = 'Authorize',
}

export interface OrganizationTicketsResponse {
  number: string;
  short_description: string;
  priority: string;
  create_time: string;
  department: string;
  requester: string;
  task_type: string;
  url: string;
  state: OrgTicketStatus;
}

export interface SearchOrganizationTicketsResponse {
  tickets: OrganizationTicketsResponse[];
}

export interface GetOrganizationResponse {
  org: OrganizationResponse;
  contacts: ContactsResponse;
}

export interface CreateOrganizationResponse {
  org: OrganizationResponse;
}

export interface EditOrganizationResponse {
  org: OrganizationResponse;
}

export interface BulkInviteOrgMembersResponse {
  errors: BulkInviteOrgMembersResponseUsers[];
}
export interface BulkInviteOrgMembersResponseUsers {
  username: string;
  error: string;
}

export interface ContactsResponse {
  customer_success: {
    email: string;
    name: string;
  };
  new_ticket_url: string;
}

export interface SearchOrganizationEntitlementsResponse {
  entitlements: OrganizationEntitlement[];
}

interface PmmInstance {
  pmm_server_id: string;
  pmm_server_name: string;
  pmm_server_url: string;
}

export interface SearchOrganizationInventoryResponse {
  inventory: PmmInstance[];
}

export interface OrganizationEntitlement {
  number: string;
  name: string;
  summary: string;
  tier: string;
  total_units: string;
  unlimited_units: boolean;
  support_level: string;
  software_families: string[];
  start_date: string;
  end_date: string;
  platform: Advisors;
}

interface Advisors {
  security_advisor: boolean;
  config_advisor: boolean;
}
