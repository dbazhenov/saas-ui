import { render, screen } from '@testing-library/react';
import { TestContainer } from 'components';
import React from 'react';
import { ClusterDefaultStep } from './ClusterDefaultStep';

describe('DBaaS Cluster Default Step', () => {
  test('renders the loader while waiting for the response', async () => {
    const isClusterLoading = true;

    render(
      <TestContainer>
        <ClusterDefaultStep isClusterLoading={isClusterLoading} />
      </TestContainer>,
    );

    const loader = await screen.findByTestId('cluster-building-loader');

    expect(loader).toBeInTheDocument();
  });

  test('renders Launch Cluster button', async () => {
    const isClusterLoading = false;

    render(
      <TestContainer>
        <ClusterDefaultStep orgId="123" onClick={() => jest.fn()} isClusterLoading={isClusterLoading} />
      </TestContainer>,
    );

    const button = await screen.findByTestId('launch-cluster');

    expect(button).toBeInTheDocument();
  });
});
