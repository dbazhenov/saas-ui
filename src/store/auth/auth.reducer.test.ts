import { toast } from 'react-toastify';
import { Action } from 'redux';
import { AxiosResponse } from 'axios';
import { logger } from '@percona/platform-core';
import { LOG_LEVELS } from '@percona/platform-core/dist/shared/logger';
import { Messages } from 'core/api/messages';
import * as authApi from 'core/api/auth';
import { HTTP_STATUS } from 'core/api';
import { AuthState, UpdateProfilePayload } from 'store/types';
import { store } from 'store';
import { getProfileAction, updateProfileAction } from './auth.actions';
import { authReducer } from './auth.reducer';

const TEST_EMAIL = 'test@test.test';
const TEST_MESSAGE = 'test';
const TEST_FIRST_NAME = 'Firstname';
const TEST_LAST_NAME = 'Lastname';

let consoleError: jest.SpyInstance;
let toastError: jest.SpyInstance;
let toastSuccess: jest.SpyInstance;
let dispatchedActions: Action[];
const { dispatch } = store;

jest.mock('core/api/orgs');

xdescribe('Auth Sagas', () => {
  beforeEach(() => {
    logger.setLogLevel(LOG_LEVELS.NONE);
    consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    toastError = jest.spyOn(toast, 'error');
    toastSuccess = jest.spyOn(toast, 'success');
    dispatchedActions = [];
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('authGetProfileFailure', async () => {
    await dispatch((getProfileAction as any)());

    expect(toastError).toBeCalledTimes(1);
    expect(toastError).toBeCalledWith(Messages.genericAPIFailure);
    expect(consoleError).toBeCalledTimes(1);
    expect(consoleError).toBeCalledWith(TEST_MESSAGE);
  });

  test('authUpdateProfileRequest succeeds', async () => {
    const updateProfile = jest
      .spyOn(authApi, 'updateProfile')
      .mockImplementation(() => Promise.resolve({} as AxiosResponse));
    const payload: UpdateProfilePayload = {
      firstName: TEST_FIRST_NAME,
      lastName: TEST_LAST_NAME,
    };

    await dispatch((updateProfileAction as any)(payload));

    expect(updateProfile).toHaveBeenCalledWith({ firstName: TEST_FIRST_NAME, lastName: TEST_LAST_NAME });
    expect(updateProfile).toHaveBeenCalledTimes(1);

    updateProfile.mockRestore();
  });

  test('authUpdateProfileRequest fails', async () => {
    const error = { code: HTTP_STATUS.BAD_REQUEST };
    const updateProfile = jest
      .spyOn(authApi, 'updateProfile')
      .mockImplementation(() => Promise.reject(error));

    await dispatch((updateProfileAction as any)({ email: TEST_EMAIL }));

    // expect(dispatchedActions).toEqual([updateProfileAction.failure(error as RequestErrorData)]);

    expect(updateProfile).toHaveBeenCalledTimes(1);

    updateProfile.mockRestore();
  });

  test('authUpdateProfileFailure (invalid argument)', async () => {
    await dispatch(
      (updateProfileAction as any)({
        code: HTTP_STATUS.BAD_REQUEST,
        message: TEST_MESSAGE,
      }),
    );

    expect(dispatchedActions).toEqual([]);
    expect(toastError).toHaveBeenCalledWith(TEST_MESSAGE);
    expect(toastError).toHaveBeenCalledTimes(1);
  });

  test('authUpdateProfileFailure (generic error)', async () => {
    const error = { code: HTTP_STATUS.INTERNAL_SERVER_ERROR };

    await dispatch((updateProfileAction.rejected as any)({ code: HTTP_STATUS.INTERNAL_SERVER_ERROR }));

    expect(dispatchedActions).toEqual([]);
    expect(toastError).toHaveBeenCalledWith(Messages.genericAPIFailure);
    expect(toastError).toHaveBeenCalledTimes(1);
    expect(consoleError).toHaveBeenCalledTimes(1);
    expect(consoleError).toHaveBeenCalledWith(error);
  });

  test('authUpdateProfileSuccess', async () => {
    await dispatch((updateProfileAction.fulfilled as any)());

    expect(toastSuccess).toBeCalledTimes(1);
    expect(toastSuccess).toBeCalledWith(Messages.updateProfileSucceeded);
  });
});

xdescribe('auth reducer', () => {
  const initialState: AuthState = {
    email: undefined,
    firstName: undefined,
    lastName: undefined,
    pending: false,
    orgRole: '',
  };

  it('should handle initial state', () => {
    expect(authReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });
});
