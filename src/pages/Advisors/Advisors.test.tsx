import React from 'react';
import { toast } from 'react-toastify';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ENDPOINTS } from 'core/api/endpoints';
import { TestContainer } from 'components/TestContainer';
import { AdvisorsPage } from '.';

const advisors = {
  advisors: {
    anonymous: {
      advisors: [
        {
          name: 'test',
          summary: 'test security',
          description: 'testing',
          category: 'security',
          checks: [
            {
              name: 'mongodb_EOL',
              summary: 'MongoDB version EOL',
              description: 'This check returns test.',
            },
          ],
        },
      ],
    },
    paid: {
      advisors: [
        {
          name: 'test',
          summary: 'test security',
          description: 'testing',
          category: 'security',
          checks: [
            {
              name: 'mongodb_EOL',
              summary: 'MongoDB version EOL',
              description: 'This check returns test.',
            },
          ],
        },
      ],
    },
    registered: {
      advisors: [
        {
          name: 'test',
          summary: 'test security',
          description: 'testing',
          category: 'security',
          checks: [
            {
              name: 'mongodb_EOL',
              summary: 'MongoDB version EOL',
              description: 'This check returns test.',
            },
          ],
        },
      ],
    },
  },
};

const mockPost = jest.fn().mockResolvedValue(advisors);
const toastError = jest.spyOn(toast, 'error');

describe('Advisors:: ', () => {
  test('renders tabs', async () => {
    render(
      <TestContainer>
        <AdvisorsPage />
      </TestContainer>,
    );

    const tabsWrapper = await screen.findByTestId('advisors-tabs-wrapper');
    const securityTab = await screen.findByTestId('security-advisors-tab');
    const performanceTab = await screen.findByTestId('performance-advisors-tab');
    const queryTab = await screen.findByTestId('query-advisors-tab');
    const configurationTab = await screen.findByTestId('configuration-advisors-tab');

    expect(tabsWrapper).toBeInTheDocument();
    expect(securityTab).toBeInTheDocument();
    expect(performanceTab).toBeInTheDocument();
    expect(queryTab).toBeInTheDocument();
    expect(configurationTab).toBeInTheDocument();
  });

  test('shows the default tab', async () => {
    render(
      <TestContainer>
        <AdvisorsPage />
      </TestContainer>,
    );
    const activeTabContent = await screen.findByTestId('advisors-tab-content');
    const securityTabContent = await screen.findByTestId('security-advisors-tab-content');

    expect(activeTabContent).toBeInTheDocument();
    expect(securityTabContent).toBeInTheDocument();
  });

  test('Does not show toast if api call is success', async () => {
    render(
      <TestContainer>
        <AdvisorsPage />
      </TestContainer>,
    );

    expect(toastError).toBeCalledTimes(0);
  });

  test('calls API to get the advisors', async () => {
    render(
      <TestContainer>
        <AdvisorsPage />
      </TestContainer>,
    );

    waitFor(() => {
      expect(mockPost).toBeCalledTimes(1);
    });
    waitFor(() => {
      expect(mockPost).toBeCalledWith(ENDPOINTS.advisors.getAdvisors);
    });
  });

  test('Switching the tabs shows the correct tab data', async () => {
    render(
      <TestContainer>
        <AdvisorsPage />
      </TestContainer>,
    );
    const performanceTab = await screen.findByTestId('performance-advisors-tab');
    const activeTabContent = await screen.findByTestId('advisors-tab-content');
    const securityTabContent = await screen.findByTestId('security-advisors-tab-content');

    expect(activeTabContent).toBeInTheDocument();
    expect(securityTabContent).toBeInTheDocument();

    await waitFor(() => userEvent.click(performanceTab));

    const performanceTabContent = await screen.findByTestId('performance-advisors-tab-content');

    expect(activeTabContent).toBeInTheDocument();
    expect(securityTabContent).not.toBeInTheDocument();
    expect(performanceTabContent).toBeInTheDocument();
  });
});
