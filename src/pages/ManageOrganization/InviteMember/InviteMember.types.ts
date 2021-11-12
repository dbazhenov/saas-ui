import { InviteMemberFormFields } from '../ManageOrganization.types';

export interface InviteMemberProps {
  onInviteMemberSubmit: ({ email, role }: InviteMemberFormFields) => Promise<void>;
  loading?: boolean;
}
