import { SelectableValue } from '@grafana/data';

export interface CreateOrganizationPayload {
  organizationName: string;
}

export enum MemberRole {
  admin = 'Admin',
  technical = 'Technical',
}

export enum MemberStatus {
  active = 'ACTIVE',
}

export interface MemberPayload {
  username: string;
  first_name: string;
  last_name: string;
  role: MemberRole;
  status: MemberStatus;
}

export interface Member {
  firstName: string;
  lastName: string;
  email: string;
  role: MemberRole;
  status: MemberStatus;
}

export interface InviteMemberFormFields {
  email: string;
  role: SelectableValue<MemberRole>;
}
