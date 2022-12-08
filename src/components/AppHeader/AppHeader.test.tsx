import React from 'react';
import { TestContainer } from 'components/TestContainer';
import { act, fireEvent, render } from '@testing-library/react';
import { useSelector } from 'react-redux';
import * as authApi from 'core/api/auth';
import { dataTestId } from '@percona/platform-core';
import { AppHeader } from './AppHeader';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
}));

jest.spyOn(authApi, 'signOut').mockImplementation(() => Promise.resolve({} as Response));

const mockAppState = {
  auth: {
    authenticated: true,
  },
};

xdescribe('MenuBar', () => {
  beforeEach(() => {
    (useSelector as jest.Mock<any, any>).mockImplementation((callback) => callback(mockAppState));
  });

  afterEach(() => {
    (useSelector as jest.Mock<any, any>).mockClear();
  });

  test('clicking on the profile logout button calls the logout API', async () => {
    const { container } = render(
      <TestContainer>
        <AppHeader />
      </TestContainer>,
    );

    act(() => {
      fireEvent.click(container.querySelector(dataTestId('menu-bar-profile-dropdown-toggle'))!);
    });

    await act(async () => {
      fireEvent.click(container.querySelector(dataTestId('menu-bar-profile-dropdown-logout'))!);
    });

    expect(authApi.signOut).toBeCalledTimes(1);
  });

  test('unathenticated user should not see the profile menu', async () => {
    (useSelector as jest.Mock<any, any>).mockImplementation((callback) =>
      callback({
        auth: { authenticated: false },
      }),
    );

    const { container } = render(
      <TestContainer>
        <AppHeader />
      </TestContainer>,
    );

    expect(container.querySelector(dataTestId('menu-bar-profile-dropdown-logout'))).toEqual(null);
  });
});
