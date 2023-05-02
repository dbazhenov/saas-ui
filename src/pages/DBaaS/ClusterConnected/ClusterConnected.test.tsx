import { render, screen } from '@testing-library/react';
import { TestContainer } from 'components';
import React from 'react';
import { rest } from 'msw';
import { ENDPOINTS } from 'core/api';
import { setupServer } from 'msw/node';
import { ClusterConnected } from './ClusterConnected';

const TEST_ID = 'vvvvvvvv-wwww-xxxx-yyyy-zzzzzzzzzzzz';
const DEMO_URL = 'https://demo.percona.com';
const CREATED_AT = '01/01/2023';
const { DBaaS } = ENDPOINTS;
const mswServer = setupServer();

const getClusterConfigLoading = rest.get(DBaaS.clusterGetConfig(TEST_ID), (req, res, ctx) =>
  res(ctx.delay(1)),
);

const getStatusClusterCreated = rest.get(DBaaS.clusterGetConfig(TEST_ID), (req, res, ctx) =>
  res({
    kubeconfig: '123456789',
  }),
);

describe('DBaaS Cluster Creation', () => {
  beforeAll(() => mswServer.listen());
  afterEach(() => {
    mswServer.resetHandlers();
  });
  afterAll(() => mswServer.close());

  test('renders the loader while waiting for the response', async () => {
    mswServer.use(getClusterConfigLoading);

    render(
      <TestContainer>
        <ClusterConnected clusterId={TEST_ID} pmmDemoUrl={DEMO_URL} createdAt={CREATED_AT} />
      </TestContainer>,
    );

    const cluster_created = await screen.findByTestId('cluster-building-loader');

    expect(cluster_created).toBeInTheDocument();
  });

  test('renders the successful step of cluster creation', async () => {
    mswServer.use(getStatusClusterCreated);

    render(
      <TestContainer>
        <ClusterConnected clusterId={TEST_ID} pmmDemoUrl={DEMO_URL} createdAt={CREATED_AT} />
      </TestContainer>,
    );

    const cluster_created = await screen.findByTestId('cluster-created');

    expect(cluster_created).toBeInTheDocument();
  });
});
