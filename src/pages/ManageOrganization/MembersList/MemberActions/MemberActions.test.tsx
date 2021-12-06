import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { TestContainer } from 'components/TestContainer';
import { MemberRole, MemberStatus } from '../../ManageOrganization.types';
import { ManageOrganizationProvider } from '../../ManageOrganization.provider';
import { MemberActions } from '.';

const testUserInfo = {
  email: 'test1@test.com',
  firstName: 'First1',
  lastName: 'Last1',
  pending: false,
};

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

describe('Member Actions', () => {
  test('renders the component', async () => {
    render(
      <TestContainer>
        <ManageOrganizationProvider.Provider
          value={{
            onDeleteMemberSubmit: jest.fn(),
            onEditMemberSubmit: jest.fn(),
            loading: false,
            userInfo: testUserInfo,
            userRole: MemberRole.admin,
          }}
        >
          <MemberActions member={testMember1} />
        </ManageOrganizationProvider.Provider>
      </TestContainer>,
    );

    expect(screen.queryByTestId('member-actions')).toBeInTheDocument();
    expect(screen.queryByTestId('member-actions-edit')).toBeInTheDocument();
  });

  test('the edit action is disabled for the current admin user', async () => {
    render(
      <TestContainer>
        <ManageOrganizationProvider.Provider
          value={{
            onDeleteMemberSubmit: jest.fn(),
            onEditMemberSubmit: jest.fn(),
            loading: false,
            userInfo: testUserInfo,
            userRole: MemberRole.admin,
          }}
        >
          <MemberActions member={testMember1} />
        </ManageOrganizationProvider.Provider>
      </TestContainer>,
    );

    expect(await screen.findByTestId('member-actions-edit')).toBeDisabled();
  });

  test('clicking on the edit action on the other members opens the edit modal', async () => {
    render(
      <TestContainer>
        <ManageOrganizationProvider.Provider
          value={{
            onDeleteMemberSubmit: jest.fn(),
            onEditMemberSubmit: jest.fn(),
            loading: false,
            userInfo: testUserInfo,
            userRole: MemberRole.admin,
          }}
        >
          <MemberActions member={testMember2} />
        </ManageOrganizationProvider.Provider>
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
        <ManageOrganizationProvider.Provider
          value={{
            onDeleteMemberSubmit: jest.fn(),
            onEditMemberSubmit: jest.fn(),
            loading: false,
            userInfo: testUserInfo,
            userRole: MemberRole.admin,
          }}
        >
          <MemberActions member={testMember2} />
        </ManageOrganizationProvider.Provider>
      </TestContainer>,
    );

    const editButton = await screen.findByTestId('member-actions-delete');

    expect(screen.queryByTestId('delete-member-form')).not.toBeInTheDocument();
    fireEvent.click(editButton);
    expect(screen.queryByTestId('delete-member-form')).toBeInTheDocument();
  });
});
