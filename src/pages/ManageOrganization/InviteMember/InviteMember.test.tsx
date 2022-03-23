import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { TestContainer } from 'components/TestContainer';
import { InviteMember } from '.';

xdescribe('Invite Members', () => {
  test('renders the invite button', async () => {
    render(
      <TestContainer>
        <InviteMember onInviteMemberSubmit={jest.fn()} />
      </TestContainer>,
    );

    const button = await screen.findByTestId('invite-member-button');

    expect(button).toBeInTheDocument();
  });

  test('the modal is not visible by default', async () => {
    render(
      <TestContainer>
        <InviteMember onInviteMemberSubmit={jest.fn()} />
      </TestContainer>,
    );

    const form = screen.queryByTestId('invite-member-form');

    expect(form).not.toBeInTheDocument();
  });

  test('shows the modal after clicking on the invite button', async () => {
    render(
      <TestContainer>
        <InviteMember onInviteMemberSubmit={jest.fn()} />
      </TestContainer>,
    );

    const button = await screen.findByTestId('invite-member-button');

    fireEvent.click(button!);

    expect(screen.queryByTestId('invite-member-form')).toBeInTheDocument();
  });

  test('closes the modal', async () => {
    render(
      <TestContainer>
        <InviteMember onInviteMemberSubmit={jest.fn()} />
      </TestContainer>,
    );

    const button = await screen.findByTestId('invite-member-button');

    fireEvent.click(button!);
    fireEvent.click(await screen.findByTestId('modal-close-button'));

    expect(screen.queryByTestId('invite-member-form')).not.toBeInTheDocument();
  });

  test('the save button is disabled if the form is not valid', async () => {
    render(
      <TestContainer>
        <InviteMember onInviteMemberSubmit={jest.fn()} />
      </TestContainer>,
    );

    const openModal = await screen.findByTestId('invite-member-button');

    fireEvent.click(openModal);

    const submitButton = await screen.findByTestId('invite-member-submit-button');

    expect(submitButton).toBeDisabled();

    const emailInput = await screen.findByTestId('email-text-input');

    fireEvent.change(emailInput, { target: { value: 'invalid@email' } });

    expect(submitButton).toBeDisabled();
  });

  test('the save button is enabled if the form is valid', async () => {
    render(
      <TestContainer>
        <InviteMember onInviteMemberSubmit={jest.fn()} />
      </TestContainer>,
    );

    const openModal = await screen.findByTestId('invite-member-button');

    fireEvent.click(openModal);

    const submitButton = await screen.findByTestId('invite-member-submit-button');
    const emailInput = await screen.findByTestId('email-text-input');

    fireEvent.change(emailInput, { target: { value: 'valid@email.com' } });

    expect(submitButton).toBeEnabled();
  });

  test('calls the passed function on submit', async () => {
    const testCallback = jest.fn();

    render(
      <TestContainer>
        <InviteMember onInviteMemberSubmit={testCallback} />
      </TestContainer>,
    );

    const openModal = await screen.findByTestId('invite-member-button');

    fireEvent.click(openModal);

    const submitButton = await screen.findByTestId('invite-member-submit-button');
    const emailInput = await screen.findByTestId('email-text-input');

    fireEvent.change(emailInput, { target: { value: 'valid@email.com' } });
    fireEvent.click(submitButton);

    expect(testCallback).toBeCalledTimes(1);
  });
});
