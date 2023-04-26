import React from 'react';
import { render, screen } from '@testing-library/react';
import { AdvisorsTable } from './AdvisorsTable';

const advisors = [
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
];

describe('AdvisorsTable::', () => {
  it('should render modal successfully', async () => {
    render(<AdvisorsTable advisors={advisors} />);

    expect(await screen.findByTestId('checks-datagrid')).toBeInTheDocument();
  });
});
