import React from 'react';
import { render, screen } from '@testing-library/react';
import { TestContainer } from 'components/TestContainer';
import { Auth } from './Auth';

jest.mock('@okta/okta-react', () => ({
  useOktaAuth: () => ({
    authState: { isAuthenticated: true },
  }),
}));

describe('Auth Page', () => {
  test('renders the page', async () => {
    render(
      <TestContainer>
        <Auth />
      </TestContainer>,
    );

    expect(screen.queryByTestId('auth-page-container')).toBeInTheDocument();
    expect(screen.queryByTestId('auth-page-left-side-wrapper')).toBeInTheDocument();
    expect(screen.queryByTestId('auth-page-logo')).toBeInTheDocument();
    expect(screen.queryByTestId('auth-page-title')).toBeInTheDocument();
    expect(screen.queryByTestId('auth-page-okta-sign-in-widget-wrapper')).toBeInTheDocument();
  });
});
