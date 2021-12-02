export interface RequestBody {
  [key: string]: any;
}

export interface RequestError {
  code: number;
  message: string;
}

export interface SignInRequest {
  email: string;
  password: string;
}

export interface SignInResponse {
  sessionId: string;
  expireTime?: string;
}

export interface SignUpRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface SignUpResponse {
  sessionId: string;
  expireTime?: string;
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

export type SignUp = ({ email, firstName, lastName, password }: SignUpRequest) =>
  Promise<SignUpResponse>;

export type GetProfile = () => Promise<GetProfileResponse>;

export type UpdateProfile = ({ firstName, lastName }: UpdateProfileRequest) =>
  Promise<Response>;

export interface OrganizationResponse {
  id: string;
  name: string;
  created_at: number;
  updated_at: number;
}

export interface SearchOrganizationsResponse {
  orgs: OrganizationResponse[],
}

export interface OrganizationMembersResponse {
  member_id: string;
  username: string;
  first_name: string;
  last_name: string;
  role: string;
  status: string;
}

export interface SearchOrganizationMembersResponse {
  members: OrganizationMembersResponse[];
}

export enum OrgTicketStatus {
  Open = 'Open',
  Closed = 'Closed',
  Resolved = 'Resolved',
}


export interface OrganizationTicketsResponse {
  number: string;
  short_description: string;
  priority: string;
  create_time: string;
  department: string;
  requester: string;
  task_type: string;
  url: string
  state: OrgTicketStatus;
}

export interface SearchOrganizationTicketsResponse {
  tickets: OrganizationTicketsResponse[],
}
