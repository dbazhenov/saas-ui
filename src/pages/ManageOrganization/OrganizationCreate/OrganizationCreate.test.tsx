import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TestContainer } from 'components/TestContainer';
import { OrganizationCreate } from '.';
import { Messages } from './OrganizationCreate.messages';

const mockPost = jest.fn();

describe('Organization Create', () => {
  test('the save button is disabled at startup', async () => {
    render(
      <TestContainer>
        <OrganizationCreate loading={false} onCreateOrgSubmit={() => Promise.resolve()} />
      </TestContainer>,
    );

    const saveButton = await screen.findByTestId('create-organization-submit-button');

    expect(saveButton).toHaveTextContent(Messages.save);
    expect(saveButton).toBeDisabled();
  });

  test('the save button is disabled if the form is invalid', async () => {
    render(
      <TestContainer>
        <OrganizationCreate loading={false} onCreateOrgSubmit={() => Promise.resolve()} />
      </TestContainer>,
    );

    const saveButton = await screen.findByTestId('create-organization-submit-button');
    const input = await screen.findByTestId('organizationName-text-input');

    userEvent.type(input, 'Test');
    userEvent.clear(input);

    expect(saveButton).toBeDisabled();
  });

  test('the save button is disabled if loading', async () => {
    render(
      <TestContainer>
        <OrganizationCreate loading onCreateOrgSubmit={() => Promise.resolve()} />
      </TestContainer>,
    );

    const saveButton = await screen.findByTestId('create-organization-submit-button');
    const input = await screen.findByTestId('organizationName-text-input');

    userEvent.type(input, 'Test');

    expect(saveButton).toBeDisabled();
  });

  test('the save button is enabled if the form is valid', async () => {
    render(
      <TestContainer>
        <OrganizationCreate loading={false} onCreateOrgSubmit={() => Promise.resolve()} />
      </TestContainer>,
    );

    const saveButton = await screen.findByTestId('create-organization-submit-button');
    const input = await screen.findByTestId('organizationName-text-input');

    userEvent.type(input, 'Test');

    expect(saveButton).toBeEnabled();
  });

  test('calls the create API on save', async () => {
    render(
      <TestContainer>
        <OrganizationCreate loading={false} onCreateOrgSubmit={mockPost} />
      </TestContainer>,
    );

    const testName = 'Test';
    const saveButton = await screen.findByTestId('create-organization-submit-button');
    const input = await screen.findByTestId('organizationName-text-input');

    userEvent.type(input, testName);

    userEvent.click(saveButton);

    expect(mockPost).toBeCalledTimes(1);
  });
});
