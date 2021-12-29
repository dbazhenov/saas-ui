import React from 'react';
import { toast } from 'react-toastify';
import { render, screen } from '@testing-library/react';
import { TestContainer } from 'components/TestContainer';
import { OrganizationView } from '.';

const mockPost = jest.fn();

const toastError = jest.spyOn(toast, 'error');

let mockError: string | null = null;

const mockData = {
  org: {
    name: 'Percona',
    created_at: '20/02/2008',
  },
};

const testOrgId = '123';

jest.mock('use-http', () => {
  const originalModule = jest.requireActual('use-http');

  return {
    ...originalModule,
    __esModule: true,
    CachePolicies: {
      NO_CACHE: 'no-cache',
    },
    default: () => ({
      error: mockError,
      loading: false,
      post: mockPost,
      data: mockData,
      response: {
        ok: true,
      },
    }),
  };
});

describe('Organization View', () => {
  test('shows an error if the API call fails', async () => {
    mockError = 'Error';

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
