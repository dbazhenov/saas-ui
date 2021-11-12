import React from 'react';
import { toast } from 'react-toastify';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TestContainer } from 'components/TestContainer';
import { ManageOrganizationPage } from '.';
import { GET_USER_ORGS_URL } from './ManageOrganization.constants';

const mockPost = jest.fn().mockResolvedValue({
  orgs: [{ id: '1337' }],
  members: [{
    'member_id': 'test-uid',
    'username': 'test@test.com',
    'first_name': 'Test',
    'last_name': 'User',
    'role': 'Admin',
    'status': 'ACTIVE',
  }],
});

const toastError = jest.spyOn(toast, 'error');
const toastSuccess = jest.spyOn(toast, 'success');

let mockError: string | null = null;

let mockData = {};
const testId = '123';

jest.mock('use-http', () => {
  const originalModule = jest.requireActual('@percona/platform-core');

  return {
    ...originalModule,
    __esModule: true,
    CachePolicies: {
      NO_CACHE: 'no-cache',
    },
    default: () => ({
      data: mockData,
      error: mockError,
      loading: false,
      post: mockPost,
      response: {
        ok: true,
      },
    }),
  };
});

xdescribe('Manage Organization', () => {
  test('renders header and tabs', async () => {
    render(
      <TestContainer>
        <ManageOrganizationPage />
      </TestContainer>,
    );

    const header = await screen.findByTestId('manage-organization-header');
    const tabsWrapper = await screen.findByTestId('manage-organization-tabs-wrapper');

    expect(header).toBeInTheDocument();
    expect(tabsWrapper).toBeInTheDocument();
  });

  test('shows the default tab', async () => {
    render(
      <TestContainer>
        <ManageOrganizationPage />
      </TestContainer>,
    );
    const activeTabContent = await (screen.findByTestId('manage-organization-tab-content'));

    expect(activeTabContent).not.toBeEmptyDOMElement();
  });

  test('shows an error if an API call fails', async () => {
    mockError = 'Error';

    render(
      <TestContainer>
        <ManageOrganizationPage />
      </TestContainer>,
    );

    expect(toastError).toBeCalledTimes(1);
  });

  test('calls API to get the organizations the user is part of', async () => {
    render(
      <TestContainer>
        <ManageOrganizationPage />
      </TestContainer>,
    );

    waitFor(() => { expect(mockPost).toBeCalledTimes(1); });
    waitFor(() => { expect(mockPost).toBeCalledWith(GET_USER_ORGS_URL); });
  });

  test('shows create form if no organizations are returned by the API for the user', async () => {
    render(
      <TestContainer>
        <ManageOrganizationPage />
      </TestContainer>,
    );

    waitFor(() => { expect(mockPost).toBeCalledTimes(1); });
    const createOrgContainer = await screen.findByTestId('create-organization');

    expect(createOrgContainer).toBeInTheDocument();
  });

  test('shows a success message after an organization is successfully created', async () => {
    const testName = 'Test';

    mockPost.mockResolvedValue({ org: { id: testId } });

    render(
      <TestContainer>
        <ManageOrganizationPage />
      </TestContainer>,
    );

    const saveButton = await screen.findByTestId('create-organization-submit-button');
    const input = await screen.findByTestId('organizationName-text-input');

    userEvent.type(input, testName);

    userEvent.click(saveButton);

    waitFor(() => { expect(toastSuccess).toBeCalledTimes(1); });
  });

  test('shows the members tab if an organization exists', async () => {
    mockData = { orgs: [{ id: testId }] };
    mockPost.mockResolvedValue({
      members: [{
        'member_id': 'test-uid',
        'username': 'test@test.com',
        'first_name': 'Test',
        'last_name': 'User',
        'role': 'Admin',
        'status': 'ACTIVE',
      }],
    });

    render(
      <TestContainer>
        <ManageOrganizationPage />
      </TestContainer>,
    );

    waitFor(() => { expect(mockPost).toBeCalledTimes(1); });
    const viewOrgContainer = await screen.findByTestId('manage-organization-members-tab');

    expect(viewOrgContainer).toBeInTheDocument();
  });
});
