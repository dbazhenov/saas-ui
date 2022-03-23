import React from 'react';
import { render, screen } from '@testing-library/react';
import { TestContainer } from 'components/TestContainer';
import { MemberRole, MemberStatus } from '../ManageOrganization.types';
import { MembersList } from '.';

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

xdescribe('Members List', () => {
  test('renders the component', async () => {
    render(
      <TestContainer>
        <MembersList members={testMembers} loading={false} />
      </TestContainer>,
    );

    expect(screen.queryByTestId('members-list-wrapper')).toBeInTheDocument();
  });
});
