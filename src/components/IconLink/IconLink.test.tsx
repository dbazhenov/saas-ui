import React from 'react';
import { render, screen } from '@testing-library/react';
import { TestContainer } from 'components/TestContainer';
import { IconLink } from './IconLink';

const pixel =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
const testAltText = 'test';
const testText = 'Test';

describe('IconLink', () => {
  it('renders the specified icon and text', async () => {
    render(
      <TestContainer>
        <IconLink alt={testAltText} to="/test" icon={pixel}>
          {testText}
        </IconLink>
      </TestContainer>,
    );

    const navLink = await screen.findByTestId('nav-link');
    const img = await screen.findByAltText(testAltText);

    expect(navLink).toHaveTextContent(testText);
    expect(navLink).toContainElement(img);
    expect(img).toHaveAttribute('src', pixel);
  });
});
