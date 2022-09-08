import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TestContainer } from 'components/TestContainer';
import { OrganizationDeleteModal } from '.';
import { Messages } from './OrganizationDeleteModal.messages';

const testOrgName = 'Test Organization';
const testOrgId = '123';

describe('Organization Delete', () => {
  test('the submit button is disabled at startup', async () => {
    render(
      <TestContainer>
        <OrganizationDeleteModal
          orgName={testOrgName}
          orgId={testOrgId}
          isVisible
          onSubmit={() => {}}
          onClose={() => {}}
        />
      </TestContainer>,
    );

    const submitButton = await screen.findByTestId('delete-organization-submit-button');

    expect(submitButton).toHaveTextContent(Messages.buttonTitle);
    expect(submitButton).toBeDisabled();
  });

  test('the submit button is disabled if the form is invalid', async () => {
    render(
      <TestContainer>
        <OrganizationDeleteModal
          orgName={testOrgName}
          orgId={testOrgId}
          isVisible
          onSubmit={() => {}}
          onClose={() => {}}
        />
      </TestContainer>,
    );

    const submitButton = await screen.findByTestId('delete-organization-submit-button');
    const input = await screen.findByTestId('orgName-text-input');

    userEvent.type(input, testOrgName);
    userEvent.clear(input);

    expect(submitButton).toBeDisabled();
  });

  test('the submit button is enabled if the form is valid', async () => {
    render(
      <TestContainer>
        <OrganizationDeleteModal
          orgName={testOrgName}
          orgId={testOrgId}
          isVisible
          onSubmit={() => {}}
          onClose={() => {}}
        />
      </TestContainer>,
    );

    const submitButton = await screen.findByTestId('delete-organization-submit-button');
    const input = await screen.findByTestId('orgName-text-input');

    userEvent.type(input, testOrgName);

    expect(submitButton).toBeEnabled();
  });
});
