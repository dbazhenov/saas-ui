import { MemberRole, MemberStatus } from 'pages/ManageOrganization/ManageOrganization.types';
import { AxiosRequestConfig } from 'axios';

export enum K8sClusterStatus {
  active = 'ACTIVE',
  available = 'AVAILABLE',
  building = 'BUILDING',
  upgrading = 'UPGRADING',
}

export interface CreateK8sClusterResponse {
  cluster_id: string;
}

export interface CreateK8sClusterResponseData {
  clusterId: string;
}

export interface GetK8sClusterStatusResponse {
  cluster_id: string;
  status: K8sClusterStatus;
  created_at: string;
}

export interface GetK8sClusterStatusResponseData {
  clusterId: string;
  status: K8sClusterStatus;
  createdAt: string;
}

export interface GetK8sClusterConfigResponse {
  kubeconfig: string;
}

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
  marketing?: boolean;
  tos?: boolean;
}

export interface ActivateProfileRequest {
  profile: {
    firstName: string;
    lastName: string;
    marketing?: boolean;
    tos?: boolean;
  };
  password: string;
  token: string;
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

export interface SearchOrg {
  created_at: string;
  id: string;
  name: string;
  tier: string;
  updated_at: string;
}

export interface SearchOrgResponse {
  orgs: SearchOrg[];
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

interface PmmInstance {
  pmm_server_id: string;
  pmm_server_name: string;
  pmm_server_url: string;
}

export interface SearchOrganizationInventoryResponse {
  inventory: PmmInstance[];
}

export interface SearchOrganizationEntitlementsResponse {
  entitlements: OrganizationEntitlement[];
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
