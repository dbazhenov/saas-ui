import React from 'react';
import { toast } from 'react-toastify';
import { render } from '@testing-library/react';
import { TestContainer } from 'components/TestContainer';
import { OrganizationView } from '.';

const mockPost = jest.fn();

const toastError = jest.spyOn(toast, 'error');

let mockError: string | null = null;

const testOrgId = '123';

jest.mock('use-http', () => {
  const originalModule = jest.requireActual('@percona/platform-core');

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
});
