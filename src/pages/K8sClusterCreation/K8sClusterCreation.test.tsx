import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { TestContainer } from 'components/TestContainer';
import { ENDPOINTS } from 'core/api';
import { K8sClusterCreationPage } from '.';

const { Kubernetes } = ENDPOINTS;

jest.mock('@okta/okta-react', () => ({
  useOktaAuth: () => ({
    authState: { isAuthenticated: true },
  }),
}));

const getStatusNotFound = rest.get(Kubernetes.k8sClusterGetStatus, async (req, res, ctx) =>
  res(ctx.status(404)),
);

const TEST_ID = 'vvvvvvvv-wwww-xxxx-yyyy-zzzzzzzzzzzz';
const DUMMY_KUBECONFIG = 'Dummy kubeconfig';

const getStatusActive = rest.get(Kubernetes.k8sClusterGetStatus, (req, res, ctx) =>
  res(
    ctx.status(200),
    ctx.json({
      cluster_id: TEST_ID,
      status: 'ACTIVE',
      created_at: '2022-09-11T17:25:34.744884Z',
      daily_limit_ends_at: '2022-09-12T17:25:34.744884Z',
    }),
  ),
);

const getStatusBuilding = rest.get(Kubernetes.k8sClusterGetStatus, (req, res, ctx) =>
  res(
    ctx.status(200),
    ctx.json({
      cluster_id: TEST_ID,
      status: 'BUILDING',
      created_at: '2022-09-11T17:25:34.744884Z',
      daily_limit_ends_at: '2022-09-12T17:25:34.744884Z',
    }),
  ),
);

const getClusterConfig = rest.get(Kubernetes.k8sClusterGetConfig(TEST_ID), (req, res, ctx) =>
  res(
    ctx.status(200),
    ctx.json({
      kubeconfig: DUMMY_KUBECONFIG,
    }),
  ),
);

const mswServer = setupServer();

describe('Kubernetes Cluster Creation', () => {
  beforeAll(() => mswServer.listen());
  afterEach(() => {
    mswServer.resetHandlers();
  });
  afterAll(() => mswServer.close());

  test('renders the cluster creation button', async () => {
    mswServer.use(getStatusNotFound);

    render(
      <TestContainer>
        <K8sClusterCreationPage />
      </TestContainer>,
    );

    const button = await screen.findByTestId('kubernetes-create-cluster-button');

    expect(button).toBeInTheDocument();
  });

  test('renders a link to get the cluster configuration', async () => {
    mswServer.use(getStatusActive);

    render(
      <TestContainer>
        <K8sClusterCreationPage />
      </TestContainer>,
    );

    const link = await screen.findByTestId('kubernetes-show-config-link');

    expect(link).toBeInTheDocument();
  });

  test('renders a loader while the cluster is building', async () => {
    mswServer.use(getStatusBuilding);

    render(
      <TestContainer>
        <K8sClusterCreationPage />
      </TestContainer>,
    );

    const loader = await screen.findByTestId('kubernetes-cluster-building-loader');

    expect(loader).toBeInTheDocument();
  });

  test('renders the cluster expiration date and time', async () => {
    mswServer.use(getStatusActive);

    render(
      <TestContainer>
        <K8sClusterCreationPage />
      </TestContainer>,
    );

    const expirationDatetime = await screen.findByTestId('kubernetes-cluster-expiration-datetime');

    expect(expirationDatetime).toHaveTextContent('09/11/2022, 08:25:34 PM');
  });

  test('renders the configuration modal', async () => {
    mswServer.use(getStatusActive, getClusterConfig);

    render(
      <TestContainer>
        <K8sClusterCreationPage />
      </TestContainer>,
    );

    const link = await screen.findByTestId('kubernetes-show-config-link');

    fireEvent.click(link);

    const textArea = await screen.findByTestId('kubernetes-cluster-config-modal-textarea');

    expect(textArea).toHaveTextContent(DUMMY_KUBECONFIG);
  });
});
