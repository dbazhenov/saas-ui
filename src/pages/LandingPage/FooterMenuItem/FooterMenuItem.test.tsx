import React from 'react';
import { render, screen } from '@testing-library/react';
import { FooterMenuItem } from '.';

describe('FooterMenuItem', () => {
  test('renders the component', () => {
    const TEST_HREF = 'test href';
    const TEST_TEXT = 'Test text';

    render(<FooterMenuItem href={TEST_HREF}>{TEST_TEXT}</FooterMenuItem>);

    const item = screen.queryByTestId(`${TEST_TEXT}-footer-menu-item`);

    expect(item).toBeInTheDocument();
    expect(item).toHaveTextContent(TEST_TEXT);
    expect(item).toHaveAttribute('href', TEST_HREF);
  });
});
