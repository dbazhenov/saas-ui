import { createApi, fetchBaseQuery, BaseQueryFn, FetchArgs } from '@reduxjs/toolkit/query/react';
import { ENDPOINTS } from 'core/api';
import {
  ActivateProfileRequest,
  UpdateProfileRequest,
  ValidateTokenRequest,
  ValidateTokenResponse,
} from 'core/api/types';
import { oktaAuth } from 'core';
import { APIError } from './types';

const { Auth } = ENDPOINTS;

const baseQuery = fetchBaseQuery({
  baseUrl: '',
  prepareHeaders: (headers) => {
    headers.set('Accept', 'application/json');
    headers.set('Content-Type', 'application/json');

    const authState = oktaAuth?.authStateManager.getAuthState();
    const accessToken = authState?.accessToken?.accessToken;

    if (accessToken) {
      headers.set('Authorization', `Bearer ${accessToken}`);
    }

    return headers;
  },
}) as BaseQueryFn<string | FetchArgs, unknown, APIError, {}>;

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery,
  refetchOnMountOrArgChange: true,
  endpoints: (builder) => ({
    editProfile: builder.mutation<void, UpdateProfileRequest>({
      query: (body) => ({
        method: 'POST',
        url: Auth.UpdateProfile,
        body,
      }),
    }),
    activateProfile: builder.mutation<void, ActivateProfileRequest>({
      query: (body) => ({
        method: 'POST',
        url: Auth.ActivateProfile,
        body,
      }),
    }),
    validateToken: builder.mutation<ValidateTokenResponse, ValidateTokenRequest>({
      query: (body) => ({
        method: 'POST',
        url: Auth.ValidateToken,
        body,
      }),
    }),
  }),
});

export const { useEditProfileMutation, useActivateProfileMutation, useValidateTokenMutation } = authApi;
