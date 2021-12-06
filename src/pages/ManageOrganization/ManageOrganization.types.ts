import { SelectableValue } from '@grafana/data';
import { AuthState } from 'store/types';

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
  member_id: string;
}

export interface Member {
  firstName: string;
  lastName: string;
  email: string;
  role: MemberRole;
  status: MemberStatus;
  memberId: string
}

export interface EditMemberFormFields {
  role: SelectableValue<MemberRole>;
}

export interface EditMemberPayload {
  memberId: string;
  role: SelectableValue<MemberRole>;
}

export interface DeleteMemberPayload {
  memberId: string;
}

export interface InviteMemberFormFields {
  email: string;
  role: SelectableValue<MemberRole>;
}

export interface ManageOrganizationContext {
  onEditMemberSubmit: ({ role, memberId }: EditMemberPayload) => Promise<void>;
  onDeleteMemberSubmit: ({ memberId }: DeleteMemberPayload) => Promise<void>;
  loading: boolean;
  userInfo: AuthState;
  userRole: string;
}
