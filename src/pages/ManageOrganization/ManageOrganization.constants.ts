import { MemberRole } from './ManageOrganization.types';
import { Messages } from './ManageOrganization.messages';

export const GET_USER_ORGS_URL = 'v1/orgs:search';
export const ORGANIZATIONS_URL = 'v1/orgs';
export const GET_MEMBERS_URL_CHUNK = 'members:search';
export const ORGANIZATION_MEMBER_URL_CHUNK = 'members';
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
