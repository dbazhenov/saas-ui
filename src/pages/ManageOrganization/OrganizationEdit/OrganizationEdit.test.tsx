import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TestContainer } from 'components/TestContainer';
import { OrganizationEdit } from '.';
import { Messages } from './OrganizationEdit.messages';

describe('Organization Edit', () => {
  test('the save button is disabled at startup', async () => {
    render(
      <TestContainer>
        <OrganizationEdit loading={false} />
      </TestContainer>,
    );

    const saveButton = await screen.findByTestId('edit-organization-submit-button');

    expect(saveButton).toHaveTextContent(Messages.save);
    expect(saveButton).toBeDisabled();
  });

  test('the save button is disabled if the form is invalid', async () => {
    render(
      <TestContainer>
        <OrganizationEdit />
      </TestContainer>,
    );

    const saveButton = await screen.findByTestId('edit-organization-submit-button');
    const input = await screen.findByTestId('organizationName-text-input');

    userEvent.type(input, 'Test');
    userEvent.clear(input);

    expect(saveButton).toBeDisabled();
  });

  test('the save button is disabled if loading', async () => {
    render(
      <TestContainer>
        <OrganizationEdit loading />
      </TestContainer>,
    );

    const saveButton = await screen.findByTestId('edit-organization-submit-button');
    const input = await screen.findByTestId('organizationName-text-input');

    userEvent.type(input, 'Test');

    expect(saveButton).toBeDisabled();
  });

  test('the save button is enabled if the form is valid', async () => {
    render(
      <TestContainer>
        <OrganizationEdit loading={false} />
      </TestContainer>,
    );

    const saveButton = await screen.findByTestId('edit-organization-submit-button');
    const input = await screen.findByTestId('organizationName-text-input');

    userEvent.type(input, 'Test');

    expect(saveButton).toBeEnabled();
  });
});
