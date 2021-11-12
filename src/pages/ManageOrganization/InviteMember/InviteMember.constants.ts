import { Messages } from './InviteMember.messages';
import { MemberRole } from '../ManageOrganization.types';

export const ROLES = [
  {
    value: MemberRole.admin,
    label: Messages.admin,
  },
  {
    value: MemberRole.technical,
    label: Messages.technicalUser,
  },
];
