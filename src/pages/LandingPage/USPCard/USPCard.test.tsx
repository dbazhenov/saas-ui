import React from 'react';
import { render, screen } from '@testing-library/react';
import { USPCard } from '.';

describe('USPCard', () => {
  test('renders the component', () => {
    const TEST_TITLE = 'Test title';
    const TEST_TEXT = 'Test text';
    const TEST_ICON = () => <svg>test</svg>;

    render(<USPCard title={TEST_TITLE} text={TEST_TEXT} icon={TEST_ICON} />);

    expect(screen.queryByTestId('uspcard-icon')).toBeInTheDocument();
    expect(screen.queryByTestId('uspcard-title')).toBeInTheDocument();
    expect(screen.queryByTestId('uspcard-text')).toBeInTheDocument();
    expect(screen.queryByTestId('uspcard-title')).toHaveTextContent(TEST_TITLE);
    expect(screen.queryByTestId('uspcard-text')).toHaveTextContent(TEST_TEXT);
  });
});
