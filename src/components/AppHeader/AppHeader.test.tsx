import React from 'react';
import { TestContainer } from 'components/TestContainer';
import { act, screen, fireEvent, render } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { useSelector } from 'react-redux';
import { Routes, RouteNames } from 'core';
import * as authApi from 'core/api/auth';
import { AppHeader } from './AppHeader';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
}));

const mockAppState = {
  auth: {
    authenticated: true,
  },
};

describe('MenuBar', () => {
  beforeEach(() => {
    (useSelector as jest.Mock<any, any>).mockImplementation((callback) => callback(mockAppState));
  });

  afterEach(() => {
    (useSelector as jest.Mock<any, any>).mockClear();
  });

  test('shows the page title when available', async () => {
    const history = createMemoryHistory();

    render(
      <TestContainer history={history}>
        <AppHeader />
      </TestContainer>,
    );

    act(() => {
      history.push(Routes.organization);
    });
    expect(await screen.findByTestId('page-title')).toHaveTextContent(RouteNames[Routes.organization]);

    act(() => {
      history.push(Routes.home);
    });
    expect(await screen.findByTestId('page-title')).toHaveTextContent(RouteNames[Routes.home]);
  });

  xtest('clicking on the profile logout button calls the logout API', async () => {
    render(
      <TestContainer>
        <AppHeader />
      </TestContainer>,
    );

    act(() => {
      fireEvent.click(screen.getByTestId('menu-bar-profile-dropdown-toggle')!);
    });

    await act(async () => {
      fireEvent.click(screen.getByTestId('menu-bar-profile-dropdown-logout')!);
    });

    expect(authApi.signOut).toBeCalledTimes(1);
  });

  xtest('unathenticated user should not see the profile menu', async () => {
    (useSelector as jest.Mock<any, any>).mockImplementation((callback) =>
      callback({
        auth: { authenticated: false },
      }),
    );

    render(
      <TestContainer>
        <AppHeader />
      </TestContainer>,
    );

    expect(screen.getByTestId('menu-bar-profile-dropdown-logout')).toEqual(null);
  });
});
