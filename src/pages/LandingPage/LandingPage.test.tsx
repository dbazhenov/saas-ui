import React from 'react';
import { render, screen } from '@testing-library/react';
import { TestContainer } from 'components/TestContainer';
import { LandingPage } from '.';

jest.mock('@okta/okta-react', () => ({
  useOktaAuth: () => ({
    authState: { isAuthenticated: true },
  }),
}));

describe('Landing Page', () => {
  test('renders the page', async () => {
    render(
      <TestContainer>
        <LandingPage />
      </TestContainer>,
    );

    expect(screen.queryByTestId('landing-page-container')).toBeInTheDocument();
    expect(screen.queryByTestId('landing-page-description')).toBeInTheDocument();
    expect(screen.queryByTestId('landing-page-logo')).toBeInTheDocument();
    expect(screen.queryByTestId('landing-page-title')).toBeInTheDocument();
    expect(screen.queryByTestId('landing-page-main-ctas')).toBeInTheDocument();
    expect(screen.queryByTestId('landing-page-get-demo')).toBeInTheDocument();
    expect(screen.queryByTestId('landing-page-footer')).toBeInTheDocument();
  });
});
