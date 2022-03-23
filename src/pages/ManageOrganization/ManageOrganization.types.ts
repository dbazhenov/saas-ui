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

export interface EditMemberFormFields {
  role: SelectableValue<MemberRole>;
  email: string;
  name: string;
}

export interface EditMemberPayload {
  memberId: string;
  role: SelectableValue<MemberRole>;
}

export interface RemoveMemberPayload {
  memberId: string;
}

export interface InviteMemberFormFields {
  email: string;
  role: SelectableValue<MemberRole>;
}
