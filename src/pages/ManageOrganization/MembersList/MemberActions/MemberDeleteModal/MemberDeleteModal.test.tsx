import React from 'react';
import { useSelector } from 'react-redux';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemberDeleteModal } from './MemberDeleteModal';
import { MemberRole, MemberStatus } from '../../../ManageOrganization.types';

const testMember1 = {
  firstName: 'First1',
  lastName: 'Last1',
  email: 'test1@test.com',
  role: MemberRole.admin,
  status: MemberStatus.active,
  memberId: 'member_id_1',
};

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
}));

const mockAppState = {
  orgs: {
    pending: false,
  },
};

describe('MemberDeleteModal::', () => {
  beforeEach(() => {
    (useSelector as jest.Mock<any, any>).mockImplementation((callback) => callback(mockAppState));
  });

  afterEach(() => {
    (useSelector as jest.Mock<any, any>).mockClear();
  });

  it('should render modal successfully', async () => {
    render(<MemberDeleteModal member={testMember1} onSubmit={() => {}} onClose={() => {}} isVisible />);

    expect(await screen.findByTestId('modal-body')).toBeInTheDocument();
    expect(await screen.findByTestId('modal-content')).toBeInTheDocument();
  });

  it('should call onClose when closing the modal', async () => {
    const onClose = jest.fn();

    render(<MemberDeleteModal member={testMember1} onSubmit={() => {}} onClose={onClose} isVisible />);

    expect(onClose).toBeCalledTimes(0);
    userEvent.click(await screen.findByTestId('delete-member-cancel-button'));
    expect(onClose).toBeCalledTimes(1);
  });

  it('should call onSubmit when confirming', async () => {
    const onSubmit = jest.fn();

    render(<MemberDeleteModal member={testMember1} onSubmit={onSubmit} onClose={() => {}} isVisible />);

    expect(onSubmit).toBeCalledTimes(0);
    userEvent.click(await screen.findByTestId('delete-member-submit-button'));
    expect(onSubmit).toBeCalledTimes(1);
  });
});
