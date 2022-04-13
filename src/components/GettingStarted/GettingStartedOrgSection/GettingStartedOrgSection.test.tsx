import React from 'react';
import { toast } from 'react-toastify';
import { act, render, screen, waitFor } from '@testing-library/react';
import { ENDPOINTS } from 'core/api';
import { TestContainer } from 'components/TestContainer';
import { GettingStartedOrgSection } from './GettingStartedOrgSection';
import { Messages } from './GettingStartedOrgSection.messages';

const mockPostReturn = {
  orgs: [{ id: 1337 }],
  name: 'Percona SN Company',
};

const mockPost = jest.fn().mockResolvedValue(mockPostReturn);

const toastError = jest.spyOn(toast, 'error');

xdescribe('Getting Started Organization Section', () => {
  beforeAll(() => {
    mockPost.mockClear();
  });

  test('shows an error if an API call fails', async () => {
    render(
      <TestContainer>
        <GettingStartedOrgSection />
      </TestContainer>,
    );

    expect(toastError).toBeCalledTimes(1);
  });

  test('calls API to get the organizations the user is part of', async () => {
    render(
      <TestContainer>
        <GettingStartedOrgSection />
      </TestContainer>,
    );

    waitFor(() => { expect((mockPost)).toBeCalledTimes(1); });
    waitFor(() => { expect((mockPost)).toBeCalledWith(ENDPOINTS.Org.getUserOganizations); });
  });

  test('shows a link to create an organization if no organizations are returned by the API for the user', async () => {
    render(
      <TestContainer>
        <GettingStartedOrgSection />
      </TestContainer>,
    );

    waitFor(() => expect(mockPost).toHaveBeenCalledTimes(2));

    act(() => {
      expect(screen.findByText(Messages.addOrganization));
    });
  });

  test('shows a link to view the details of the first organization returned by the API for the user', async () => {
    render(
      <TestContainer>
        <GettingStartedOrgSection />
      </TestContainer>,
    );

    waitFor(() => { expect((mockPost)).toBeCalledTimes(1); });
    expect(await screen.findByText(Messages.viewOrganization));
  });

  test('calls API to get company when user has no orgs', async () => {
    mockPost.mockResolvedValue(mockPostReturn);

    render(
      <TestContainer>
        <GettingStartedOrgSection />
      </TestContainer>,
    );

    waitFor(() => { expect(mockPost).toBeCalledTimes(1); });
    waitFor(() => { expect(mockPost).toBeCalledWith(ENDPOINTS.Org.getUserCompany); });
  });

  test('shows a link to view the details if user has no orgs but has company in ServiceNow', async () => {
    mockPost.mockResolvedValue({
      orgs: [],
      name: 'Percona SN Company',
    });

    render(
      <TestContainer>
        <GettingStartedOrgSection />
      </TestContainer>,
    );

    waitFor(() => { expect(mockPost).toBeCalledTimes(1); });
    expect(await screen.findByText(Messages.viewOrganization));
  });
});
