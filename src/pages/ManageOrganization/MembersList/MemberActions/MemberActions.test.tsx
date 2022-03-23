import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { TestContainer } from 'components/TestContainer';
import { MemberRole, MemberStatus } from '../../ManageOrganization.types';
import { MemberActions } from '.';

const testMember1 = {
  firstName: 'First1',
  lastName: 'Last1',
  email: 'test1@test.com',
  role: MemberRole.admin,
  status: MemberStatus.active,
  memberId: 'member_id_1',
};

const testMember2 = {
  firstName: 'First2',
  lastName: 'Last2',
  email: 'test2@test.com',
  role: MemberRole.technical,
  status: MemberStatus.active,
  memberId: 'member_id_2',
};

xdescribe('Member Actions', () => {
  test('renders the component', async () => {
    render(
      <TestContainer>
        <MemberActions member={testMember1} />
      </TestContainer>,
    );

    expect(screen.queryByTestId('member-actions')).toBeInTheDocument();
    expect(screen.queryByTestId('member-actions-edit')).toBeInTheDocument();
  });

  test('the edit action is disabled for the current admin user', async () => {
    render(
      <TestContainer>
        <MemberActions member={testMember1} />
      </TestContainer>,
    );

    expect(await screen.findByTestId('member-actions-edit')).toBeDisabled();
  });

  test('clicking on the edit action on the other members opens the edit modal', async () => {
    render(
      <TestContainer>
        <MemberActions member={testMember2} />
      </TestContainer>,
    );

    const editButton = await screen.findByTestId('member-actions-edit');

    expect(screen.queryByTestId('edit-member-form')).not.toBeInTheDocument();
    fireEvent.click(editButton);
    expect(screen.queryByTestId('edit-member-form')).toBeInTheDocument();
  });

  test('clicking on the delete action on the other members opens the confirmation modal', async () => {
    render(
      <TestContainer>
        <MemberActions member={testMember2} />
      </TestContainer>,
    );

    const editButton = await screen.findByTestId('member-actions-delete');

    expect(screen.queryByTestId('delete-member-form')).not.toBeInTheDocument();
    fireEvent.click(editButton);
    expect(screen.queryByTestId('delete-member-form')).toBeInTheDocument();
  });
});
