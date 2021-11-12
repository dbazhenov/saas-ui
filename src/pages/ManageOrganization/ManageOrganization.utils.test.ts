import { formatMembers } from './ManageOrganization.utils';
import { MemberRole, MemberStatus } from './ManageOrganization.types';

describe('ManageOrganization utils', () => {
  test('formatMembers', () => {
    const testInput = [
      {
        first_name: 'First1',
        last_name: 'Last1',
        username: 'test1@test.com',
        role: MemberRole.admin,
        status: MemberStatus.active,
      },
      {
        first_name: 'First2',
        last_name: 'Last2',
        username: 'test2@test.com',
        role: MemberRole.technical,
        status: MemberStatus.active,
      },
    ];

    const expectedOutput = [
      {
        firstName: 'First1',
        lastName: 'Last1',
        email: 'test1@test.com',
        role: MemberRole.admin,
        status: MemberStatus.active,
      },
      {
        firstName: 'First2',
        lastName: 'Last2',
        email: 'test2@test.com',
        role: MemberRole.technical,
        status: MemberStatus.active,
      },
    ];

    expect(formatMembers(testInput)).toEqual(expectedOutput);
  });
});
