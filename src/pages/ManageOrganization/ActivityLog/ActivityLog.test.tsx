import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { TestContainer } from 'components/TestContainer';
import { EventsSearchRequest } from 'core/api/types';
import MockDate from 'mockdate';
import { AppState } from 'store/types';
import userEvent from '@testing-library/user-event';
import { DeepPartial } from 'core';
import { ActivityLog } from './ActivityLog';

const mockState: DeepPartial<AppState> = {
  orgs: {
    currentOrg: {
      org: {
        id: 'randomOrgId',
        name: 'randomOrgName',
      },
    },
    orgs: [
      {
        id: 'randomOrgId',
        name: 'randomOrgName',
      },
    ],
  },
};

const requestObj = {
  fsp: {
    filters: [
      {
        field: {
          name: 'organization_id',
          value: 'randomOrgId',
        },
      },
      {
        field: {
          name: 'timestamp',
          value: '2016-05-20T12:08:10.000Z',
        },
        filter_type: 3,
      },
      {
        field: {
          name: 'timestamp',
          value: '2016-06-20T23:59:59.999Z',
        },
        filter_type: 5,
      },
    ],
    page_params: {
      index: 0,
      page_size: 10,
    },
    sorting_params: {
      field_name: 'timestamp',
      order: 1,
    },
  },
};

const responseObj = {
  events: new Array(10).fill(null).map((val, index) => ({
    id: JSON.stringify(index),
    okta_user_id: 'randomID',
    request_id: JSON.stringify(index + 100),
    user_ip_address: 'randomIP',
    user_agent: 'randomAgent',
    user_role: 'Technical',
    organization_id: 'randomID',
    action_type: 'LOG_OUT',
    timestamp: '2023-01-19T08:12:21.877Z',
    event_source: 'randomURL',
    action_status: {
      code: 'SUCCESS',
      message: '',
    },
    objects: [
      {
        id: JSON.stringify(index + 200),
        name: 'RandomName',
        type: 'organization_member',
        initial_state: {},
        result_state: {},
      },
    ],
  })),
  page_totals: {
    total_items: 20,
    total_pages: 2,
  },
};

const mockActivateProfileFn = jest.fn();
const postActivateProfile = rest.post('/v1/events:search', async (req, res, ctx) => {
  const reqJSON: EventsSearchRequest = await req.json();

  mockActivateProfileFn(reqJSON);

  return res(ctx.body(JSON.stringify(responseObj)));
});

jest.mock('@okta/okta-react', () => ({
  useOktaAuth: () => ({
    authState: { isAuthenticated: true },
  }),
}));

const handlers = [postActivateProfile];
const mswServer = setupServer(...handlers);

describe('Activity Log page', () => {
  beforeAll(() => {
    mswServer.listen();
  });
  beforeEach(() => {
    MockDate.set(new Date(1466424490000));
  });
  afterEach(() => {
    mswServer.resetHandlers();
    MockDate.reset();
  });
  afterAll(() => mswServer.close());

  test('renders table', async () => {
    const { getAllByRole, getByText, getAllByText } = render(
      <TestContainer>
        <ActivityLog />
      </TestContainer>,
    );

    await waitFor(() => expect(mockActivateProfileFn).toBeCalledTimes(1));
    await waitFor(() => expect(getAllByRole('row').length).toBe(11));
    expect(getAllByText('User randomID has logged out')[0]).toBeInTheDocument();

    expect(getByText('1–10 of 20')).toBeInTheDocument();
  });

  test('shows next page', async () => {
    const { getByTitle, getByText } = render(
      <TestContainer>
        <ActivityLog />
      </TestContainer>,
    );

    await waitFor(() => expect(mockActivateProfileFn).toBeCalledTimes(1));

    userEvent.click(getByTitle('Go to next page'));
    await waitFor(() => expect(mockActivateProfileFn).toBeCalledTimes(2));

    expect(getByText('11–20 of 20')).toBeInTheDocument();
  });

  test('Change timeframe', async () => {
    const { getByText } = render(
      <TestContainer preloadedState={mockState}>
        <ActivityLog />
      </TestContainer>,
    );

    await waitFor(() => expect(mockActivateProfileFn).toBeCalledTimes(1));

    userEvent.click(getByText('Last 24 hours'));
    userEvent.click(getByText('Last month'));

    mockActivateProfileFn.mockReset();
    await waitFor(() => expect(mockActivateProfileFn).toHaveBeenCalledWith(requestObj));
  });
});
