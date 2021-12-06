import { MemberRole } from './ManageOrganization.types';
import { Messages } from './ManageOrganization.messages';

export const DEFAULT_TAB_INDEX = 1;

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
