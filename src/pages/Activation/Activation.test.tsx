import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { Provider, ReactReduxContext } from 'react-redux';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { store } from 'store';
import { Routes } from 'core';
import createMemoryHistory from 'history/createMemoryHistory';
import { ConnectedRouter } from 'connected-react-router';
import Activation from './Activation';

const mockActivateProfileFn = jest.fn();
const postActivateProfile = rest.post('/v1/auth/ActivateProfile', async (req, res, ctx) => {
  mockActivateProfileFn(await req.json());

  return res(ctx.status(200, 'OK'));
});

const mockValidateTokenFn = jest.fn();
const postValidateToken = rest.post('/v1/auth/ValidateToken', async (req, res, ctx) => {
  mockValidateTokenFn(await req.json());

  return res(ctx.body(JSON.stringify({ state_token: 'aaa' })));
});

const token = 'abc';
const responseObj = {
  password: '123aBCDe321',
  profile: {
    firstName: 'Peter',
    lastName: 'Parkour',
    marketing: true,
    tos: true,
  },
  token: 'aaa',
};

jest.mock('@okta/okta-react', () => ({
  useOktaAuth: () => ({
    authState: { isAuthenticated: true },
  }),
}));

const handlers = [postActivateProfile, postValidateToken];
const mswServer = setupServer(...handlers);

describe('Activation page', () => {
  beforeAll(() => mswServer.listen());
  afterEach(() => {
    mswServer.resetHandlers();
  });
  afterAll(() => mswServer.close());

  test('password rules work', async () => {
    // eslint-disable-next-line max-len
    const url = `/activation?token=${token}`;
    const history = createMemoryHistory({ initialEntries: [url] });

    const { container, getByTestId } = render(
      <Provider store={store} context={ReactReduxContext}>
        <ConnectedRouter history={history} context={ReactReduxContext}>
          <Activation />
        </ConnectedRouter>
      </Provider>,
    );

    await waitFor(() => expect(getByTestId('password-password-input')).toBeInTheDocument());

    const passwordInput = getByTestId('password-password-input');

    /* at least 10 characters, ✓ number, uppercase, lowercase, ✓ no first name, ✓ no last name */
    fireEvent.change(passwordInput, { target: { value: '123' } });
    await waitFor(() => expect(container.querySelector('.Mui-error')).toBeInTheDocument());

    /* at least 10 characters, ✓ number, ✓uppercase, lowercase, ✓ no first name, ✓ no last name */
    fireEvent.change(passwordInput, { target: { value: '123P' } });
    await waitFor(() => expect(container.querySelector('.Mui-error')).toBeInTheDocument());

    /* at least 10 characters, ✓ number, ✓uppercase, ✓lowercase, ✓ no first name, ✓ no last name */
    fireEvent.change(passwordInput, { target: { value: '123Pa' } });
    await waitFor(() => expect(container.querySelector('.Mui-error')).toBeInTheDocument());

    /* ✓ at least 10 characters, ✓ number, ✓uppercase, ✓ lowercase, ✓ no first name, no last name */
    fireEvent.change(passwordInput, { target: { value: '123Parkour' } });
    await waitFor(() => expect(container.querySelector('.Mui-error')).toBeInTheDocument());

    /* ✓ at least 10 characters, ✓ number, ✓uppercase, ✓ lowercase, no first name, ✓ no last name */
    fireEvent.change(passwordInput, { target: { value: '123pEter321' } });
    await waitFor(() => expect(container.querySelector('.Mui-error')).toBeInTheDocument());

    /* ✓ at least 10 characters, ✓ number, ✓uppercase, ✓ lowercase, ✓ no first name, ✓ no last name */
    fireEvent.change(passwordInput, { target: { value: '123aBCDe321' } });
    await waitFor(() => expect(container.querySelector('.Mui-error')).not.toBeInTheDocument());

    const repeatPasswordInput = getByTestId('repeatPassword-password-input');

    fireEvent.change(repeatPasswordInput, { target: { value: 'abcdefg' } });
    await waitFor(() => expect(container.querySelector('.Mui-error')).toBeInTheDocument());

    fireEvent.change(repeatPasswordInput, { target: { value: '123aBCDe321' } });
    await waitFor(() => expect(container.querySelector('.Mui-error')).not.toBeInTheDocument());
  });

  test('requires ToS', async () => {
    const url = `/activation?token=${token}`;
    const history = createMemoryHistory({ initialEntries: [url] });

    const { getByTestId } = render(
      <Provider store={store} context={ReactReduxContext}>
        <ConnectedRouter history={history} context={ReactReduxContext}>
          <Activation />
        </ConnectedRouter>
      </Provider>,
    );

    await waitFor(() => expect(getByTestId('firstName-text-input')).toBeInTheDocument());

    const firstNameInput = getByTestId('firstName-text-input');
    const lastNameInput = getByTestId('lastName-text-input');
    const passwordInput = getByTestId('password-password-input');
    const repeatPasswordInput = getByTestId('repeatPassword-password-input');
    const marketingCheckbox = getByTestId('marketing-checkbox-input');
    const tosCheckbox = getByTestId('tos-checkbox-input');
    const activateAccountButton = getByTestId('activate-account-button');

    fireEvent.change(firstNameInput, { target: { value: 'Peter' } });
    fireEvent.change(lastNameInput, { target: { value: 'Parkour' } });
    fireEvent.change(passwordInput, { target: { value: '123aBCDe321' } });
    fireEvent.change(repeatPasswordInput, { target: { value: '123aBCDe321' } });
    await waitFor(() => expect(activateAccountButton).toBeDisabled());

    fireEvent.click(marketingCheckbox);
    await waitFor(() => expect(activateAccountButton).toBeDisabled());

    fireEvent.click(tosCheckbox);
    await waitFor(() => expect(activateAccountButton).not.toBeDisabled());

    fireEvent.click(activateAccountButton);

    await waitFor(() => expect(history.location.pathname).toBe(Routes.login));
    expect(mockActivateProfileFn).toHaveBeenCalledWith(responseObj);
  });
});
