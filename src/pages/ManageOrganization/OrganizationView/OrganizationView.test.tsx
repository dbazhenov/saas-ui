import React from 'react';
import { toast } from 'react-toastify';
import { render, screen } from '@testing-library/react';
import { TestContainer } from 'components/TestContainer';
import { OrganizationView } from '.';

const toastError = jest.spyOn(toast, 'error');

const testOrgId = '123';

xdescribe('Organization View', () => {
  test('shows an error if the API call fails', async () => {
    render(
      <TestContainer>
        <OrganizationView orgId={testOrgId} />
      </TestContainer>,
    );

    expect(toastError).toBeCalledTimes(1);
  });

  test('shows info if fromCustomerPortal is set ', async () => {
    render(
      <TestContainer>
        <OrganizationView orgId={testOrgId} fromCustomerPortal />
      </TestContainer>,
    );

    expect(screen.getByTestId('info-wrapper')).toBeInTheDocument();
  });
});
