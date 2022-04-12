import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TestContainer } from 'components/TestContainer';
import { LoginPage } from './Login';

const mockedSignInWithRedirect = jest.fn();

jest.mock('@okta/okta-react', () => ({
    useOktaAuth: () => ({
      oktaAuth: {
        signInWithRedirect: mockedSignInWithRedirect,
      },
    }),
  }),
);

xdescribe('Portal Login', () => {
  test('has a login button', async () => {
    render(<TestContainer><LoginPage /></TestContainer>);

    expect(await screen.findByTestId('login-button')).toBeInTheDocument();
  });

  test('has a "sign-up" link', async () => {
    render(<TestContainer><LoginPage /></TestContainer>);

    expect(await screen.findByTestId('signup-link')).toBeInTheDocument();
  });

  test('has a "reset password" link', async () => {
    render(<TestContainer><LoginPage /></TestContainer>);

    expect(await screen.findByTestId('login-reset-password-link')).toBeDefined();
  });

  test('has a "help" link', async () => {
    render(<TestContainer><LoginPage /></TestContainer>);

    expect(await screen.findByTestId('login-help-link')).toBeDefined();
  });

  test('calls the login function on login button click', async () => {
    render(<TestContainer><LoginPage /></TestContainer>);

    const loginButton = await screen.findByTestId('login-button');

    userEvent.click(loginButton);

    expect(mockedSignInWithRedirect).toBeCalledTimes(1);
  });
});
