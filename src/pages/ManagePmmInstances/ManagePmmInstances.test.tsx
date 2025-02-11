import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { TestContainer } from 'components/TestContainer';
import { ENDPOINTS } from 'core/api/endpoints';
import { ManagePmmInstancesPage } from '.';

const mockPost = jest.fn().mockResolvedValue({
  inventory: [
    {
      id: 'test-uid1',
      name: 'test1',
      url: 'https://example.com',
    },
    {
      id: 'test-uid2',
      name: 'test2',
      url: 'https://example.org',
    },
    {
      id: 'test-uid3',
      name: 'test3',
      url: 'https://example.net',
    },
  ],
});

describe('Manage PMM Instances', () => {
  test('calls API to get the list of connected PMM instances', async () => {
    render(
      <TestContainer>
        <ManagePmmInstancesPage />
      </TestContainer>,
    );

    waitFor(() => {
      expect(mockPost).toBeCalledTimes(1);
    });
    waitFor(() => {
      expect(mockPost).toBeCalledWith(ENDPOINTS.Org.searchOrgInventory);
    });
  });
});
