import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AdvancedAdvisors } from './AdvancedAdvisors';

const advisors = [
  {
    name: 'configuration_connection',
    summary: 'Connection Configuration',
    description:
      'Provides recommendations on configuring database connection parameters for improving database performance.',
    category: 'configuration',
    checks: [
      {
        name: 'mongo1',
        summary: 'MongoDB - sudden increase in connection count',
        description:
          'This check returns a warning if there is an increase in the number of connections that is higher than 50% of the most recent or normal number of connections.',
      },
      {
        name: 'mongo2',
        summary: 'MongoDB High connections',
        description:
          'This check returns the current number of connections as an informational notice when connection counts are above 5000.',
      },
    ],
  },
];

describe('AdvancedAdvisors::', () => {
  it('should render modal successfully', async () => {
    render(<AdvancedAdvisors advisors={advisors} />);

    expect(await screen.findByTestId('show-advanced-advisors-btn')).toBeInTheDocument();
  });

  it('should render modal successfully', async () => {
    render(<AdvancedAdvisors advisors={advisors} />);

    userEvent.click(await screen.findByTestId('show-advanced-advisors-btn'));
    expect(await screen.findByTestId('advanced-advisors-details')).toBeInTheDocument();
  });
});
