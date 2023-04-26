import { createApi, fetchBaseQuery, BaseQueryFn, FetchArgs } from '@reduxjs/toolkit/query/react';
import { ENDPOINTS } from 'core/api';
import { oktaAuth } from 'core';
import { AdvisorsListResponseError, AdvisorsListResponseData } from './Advisors.types';

const { advisors } = ENDPOINTS;

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
}) as BaseQueryFn<string | FetchArgs, unknown, AdvisorsListResponseError, {}>;

export const advisorsApi = createApi({
  reducerPath: 'advisorsApi',
  baseQuery,
  endpoints: (builder) => ({
    getAdvisors: builder.query<AdvisorsListResponseData, void>({
      query: () => ({
        method: 'GET',
        url: advisors.getAdvisors,
      }),
      transformResponse: (response: AdvisorsListResponseData) => ({
        advisors: {
          anonymous: response.advisors.anonymous,
          paid: response.advisors.paid,
          registered: response.advisors.registered,
        },
      }),
    }),
  }),
});

export const { useGetAdvisorsQuery } = advisorsApi;
