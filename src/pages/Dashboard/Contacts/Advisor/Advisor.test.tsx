import React from 'react';
import { render, screen } from '@testing-library/react';
import { Advisor } from './Advisor';

describe('Advisor', () => {
  test('renders Advisor with label and checked icon', async () => {
    render(<Advisor label="Test label" hasAdvisor />);

    expect(screen.getByTestId('advisor-wrapper').children.length).toBe(2);
    expect(screen.getByTestId('advisor-check-icon')).toBeInTheDocument();
    expect(screen.getByText('Test label')).toBeInTheDocument();
  });

  test('renders Advisor with label and times icon', async () => {
    render(<Advisor label="Test label" hasAdvisor={false} />);

    expect(screen.getByTestId('advisor-wrapper').children.length).toBe(2);
    expect(screen.getByTestId('advisor-times-icon')).toBeInTheDocument();
    expect(screen.getByText('Test label')).toBeInTheDocument();
  });
});
