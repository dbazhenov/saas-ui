import React from 'react';
import { render, screen } from '@testing-library/react';
import { TestContainer } from 'components/TestContainer';
import { MemberRole, MemberStatus } from '../ManageOrganization.types';
import { ManageOrganizationProvider } from '../ManageOrganization.provider';
import { MembersList } from '.';

const testUserInfo = {
  email: 'test@test.com',
  firstName: 'FirstName',
  lastName: 'LastName',
  pending: false,
};

const testMembers = [
  {
    firstName: 'First1',
    lastName: 'Last1',
    email: 'test1@test.com',
    role: MemberRole.admin,
    status: MemberStatus.active,
    memberId: 'member_id_1',
  },
  {
    firstName: 'First2',
    lastName: 'Last2',
    email: 'test2@test.com',
    role: MemberRole.admin,
    status: MemberStatus.active,
    memberId: 'member_id_2',
  },
];

describe('Members List', () => {
  test('renders the component', async () => {
    render(
      <TestContainer>
        <ManageOrganizationProvider.Provider
          value={{
            onEditMemberSubmit: jest.fn(),
            loading: false,
            userInfo: testUserInfo,
            userRole: MemberRole.admin,
          }}
        >
          <MembersList members={testMembers} loading={false} />
        </ManageOrganizationProvider.Provider>
      </TestContainer>,
    );

    expect(screen.queryByTestId('members-list-wrapper')).toBeInTheDocument();
  });
});
