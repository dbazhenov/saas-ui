import { createAction, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { getProfile, getUserCompany, updateProfile } from 'core/api/auth';
import { oktaAuth, Routes, isApiError, isAxiosError, displayAndLogError, logError } from 'core';
import { HTTP_STATUS, Messages } from 'core/api';
import { GetProfileResponse } from 'core/api/types';
import { AppState, UpdateProfilePayload } from 'store/types';
import { logger } from '@percona/platform-core';

export const loginAction = createAsyncThunk<void, void, { state: AppState; rejectValue: unknown }>(
  'USER:AUTH/LOGIN',
  async (_, { rejectWithValue }) => {
    try {
      await oktaAuth.signInWithRedirect({ originalUri: Routes.root });
    } catch (err) {
      if (isApiError(err)) {
        if (err.code === HTTP_STATUS.UNAUTHORIZED) {
          toast.error(err.message);
        }
      } else {
        toast.error(Messages.signInFailed);
        logger.error(err);
      }

      rejectWithValue(err);
    }
  },
);

export const logoutAction = createAsyncThunk<void, void, {}>('USER/AUTH:LOGOUT', async () => {
  try {
    // A redirect to Okta will follow this action
    await oktaAuth.signOut({ revokeAccessToken: true, revokeRefreshToken: true });

    // We do not show the toast on logout success
    return;
  } catch (err) {
    displayAndLogError(err);
  }
});

// USER:INFO actions are intentinally synchronous, since they are part of the middleware
export const startUserInfoAction = createAction<void>('USER:INFO/START');

export const updateUserInfoAction =
  createAction<{ email?: string; firstName?: string; lastName?: string }>('USER:INFO/UPDATE');

export const errorUserInfoAction = createAction<void>('USER:INFO/ERROR');
// END USER:INFO

export const getProfileAction = createAsyncThunk<GetProfileResponse, void, { rejectValue: unknown }>(
  'USER:PROFILE/GET',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await getProfile();

      return data;
      // We do not show the toast on getProfile success
    } catch (err) {
      displayAndLogError(err);

      return rejectWithValue(err);
    }
  },
);

export const updateProfileAction = createAsyncThunk<
  UpdateProfilePayload,
  UpdateProfilePayload,
  { rejectValue: unknown }
>('USER:PROFILE/UPDATE', async (profileData, { rejectWithValue }) => {
  try {
    await updateProfile(profileData);
    toast.success(Messages.updateProfileSucceeded);

    return profileData;
  } catch (err) {
    if (isAxiosError(err)) {
      if (err.code === String(HTTP_STATUS.BAD_REQUEST)) {
        toast.error(err.message);
      }
    } else {
      displayAndLogError(err);
    }

    return rejectWithValue(err);
  }
});

export const getUserCompanyAction = createAsyncThunk<string, void, { rejectValue: unknown }>(
  'USER:COMPANY/GET',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await getUserCompany();

      return data.name;
    } catch (err: any) {
      logError(err);

      return rejectWithValue(err.message);
    }
  },
);
