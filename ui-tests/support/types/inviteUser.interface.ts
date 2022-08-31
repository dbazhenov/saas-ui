import { UserRoles } from '../enums/userRoles';

interface InviteUserToOrg {
  username: string;
  role: UserRoles | string;
}

export default InviteUserToOrg;
