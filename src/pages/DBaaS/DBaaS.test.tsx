import { render, screen } from '@testing-library/react';
import { TestContainer } from 'components';
import React from 'react';
import { rest } from 'msw';
import { ENDPOINTS } from 'core/api';
import { setupServer } from 'msw/node';
import { ClusterStatus } from 'core/api/types';
import { DBaaSPage } from './DBaaS';

const TEST_ID = 'vvvvvvvv-wwww-xxxx-yyyy-zzzzzzzzzzzz';
const { DBaaS } = ENDPOINTS;
const mswServer = setupServer();

const getStatusClusterCreated = rest.get(DBaaS.clusterGetStatus, (req, res, ctx) =>
  res(
    ctx.status(200),
    ctx.json({
      cluster_id: TEST_ID,
      status: ClusterStatus.clusterCreated,
      created_at: '',
      daily_limit_ends_at: '2022-09-12T17:25:34.744884Z',
      failed: false,
    }),
  ),
);

const getStatusClusterLoading = rest.get(DBaaS.clusterGetStatus, (req, res, ctx) =>
  res(
    ctx.status(200),
    ctx.json({
      isLoading: true,
    }),
  ),
);

const dailyLimitExceeded = rest.get(DBaaS.clusterGetStatus, (req, res, ctx) =>
  res(
    ctx.status(200),
    ctx.json({
      cluster_id: TEST_ID,
      status: ClusterStatus.dailyLimitExceeded,
      created_at: '',
      daily_limit_ends_at: '2022-09-12T17:25:34.744884Z',
      failed: false,
    }),
  ),
);

const getStatusClusterConnected = rest.get(DBaaS.clusterGetStatus, (req, res, ctx) =>
  res(
    ctx.status(200),
    ctx.json({
      cluster_id: TEST_ID,
      status: ClusterStatus.connected,
      created_at: '2022-09-11T17:25:34.744884Z',
      daily_limit_ends_at: '2022-09-12T17:25:34.744884Z',
      failed: false,
    }),
  ),
);

const getStatusClusterFailed = rest.get(DBaaS.clusterGetStatus, (req, res, ctx) =>
  res(
    ctx.status(200),
    ctx.json({
      cluster_id: TEST_ID,
      status: ClusterStatus.clusterCreated,
      created_at: '',
      daily_limit_ends_at: '2022-09-12T17:25:34.744884Z',
      failed: true,
    }),
  ),
);

const getDefaultComponent = rest.get(DBaaS.clusterGetStatus, (req, res, ctx) =>
  res(
    ctx.status(200),
    ctx.json({
      cluster_id: TEST_ID,
      status: ClusterStatus.publicDomainSet,
      created_at: '',
      daily_limit_ends_at: '2022-09-12T17:25:34.744884Z',
      failed: false,
    }),
  ),
);

describe('DBaaS Cluster Creation', () => {
  beforeAll(() => mswServer.listen());
  afterEach(() => {
    mswServer.resetHandlers();
  });
  afterAll(() => mswServer.close());

  test('renders the cluster created', async () => {
    mswServer.use(getStatusClusterCreated);

    render(
      <TestContainer>
        <DBaaSPage />
      </TestContainer>,
    );

    const cluster_created = await screen.findByTestId('cluster-progress');

    expect(cluster_created).toBeInTheDocument();
  });

  test('renders the cluster connected', async () => {
    mswServer.use(getStatusClusterConnected);

    render(
      <TestContainer>
        <DBaaSPage />
      </TestContainer>,
    );

    const cluster_connected = await screen.findByTestId('cluster-connected');

    expect(cluster_connected).toBeInTheDocument();
  });

  test('renders the cluster failed', async () => {
    mswServer.use(getStatusClusterFailed);

    render(
      <TestContainer>
        <DBaaSPage />
      </TestContainer>,
    );

    const cluster_failed = await screen.findByTestId('cluster-failed');

    expect(cluster_failed).toBeInTheDocument();
  });

  test('renders the daily limit exceeded component', async () => {
    mswServer.use(dailyLimitExceeded);

    render(
      <TestContainer>
        <DBaaSPage />
      </TestContainer>,
    );

    const cluster_failed = await screen.findByTestId('daily-exceeded-step');

    expect(cluster_failed).toBeInTheDocument();
  });

  test('renders the default component', async () => {
    mswServer.use(getDefaultComponent);

    render(
      <TestContainer>
        <DBaaSPage />
      </TestContainer>,
    );

    const cluster_default = await screen.findByTestId('cluster-default');

    expect(cluster_default).toBeInTheDocument();
  });

  test('renders the loader', async () => {
    mswServer.use(getStatusClusterLoading);

    render(
      <TestContainer>
        <DBaaSPage />
      </TestContainer>,
    );

    const cluster_building = await screen.findByTestId('cluster-building-loader');

    expect(cluster_building).toBeInTheDocument();
  });
});
