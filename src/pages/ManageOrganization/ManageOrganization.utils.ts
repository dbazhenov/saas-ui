import { Member, MemberPayload } from './ManageOrganization.types';

export const formatMembers = (members: MemberPayload[]) => members.map(({
  first_name: firstName,
  last_name: lastName,
  username: email,
  member_id: memberId,
  ...rest
}: MemberPayload): Member => ({
    firstName,
    lastName,
    email,
    memberId,
    ...rest,
  }),
);
