import React from 'react';
import { render, screen } from '@testing-library/react';
import { TestContainer } from 'components/TestContainer';
import { TabPanel } from '.';

const testAdvisors = [
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
];

describe('TabPanel Advisors List', () => {
  test('renders the component', async () => {
    render(
      <TestContainer>
        <TabPanel advisors={testAdvisors} />
      </TestContainer>,
    );

    expect(screen.queryByTestId('advisors-list-wrapper')).toBeInTheDocument();
    expect(screen.queryByTestId('advisors-acoordian-wrapper')).toBeInTheDocument();
  });
});
