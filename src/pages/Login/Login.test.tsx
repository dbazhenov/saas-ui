import React from 'react';
import { render, screen } from '@testing-library/react';
import { TestContainer } from 'components/TestContainer';
import { LoginPage } from '.';

jest.mock('@okta/okta-react', () => ({
  useOktaAuth: () => ({
    authState: { isAuthenticated: true },
  }),
}));

describe('Login Page', () => {
  test('renders the page', async () => {
    render(
      <TestContainer>
        <LoginPage />
      </TestContainer>,
    );

    expect(screen.queryByTestId('login-page-container')).toBeInTheDocument();
    expect(screen.queryByTestId('login-page-left-side-wrapper')).toBeInTheDocument();
    expect(screen.queryByTestId('login-page-logo')).toBeInTheDocument();
    expect(screen.queryByTestId('login-page-title')).toBeInTheDocument();
    expect(screen.queryByTestId('login-page-okta-sign-in-widget-wrapper')).toBeInTheDocument();
  });
});
