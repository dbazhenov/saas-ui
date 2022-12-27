import { createApi, fetchBaseQuery, BaseQueryFn, FetchArgs } from '@reduxjs/toolkit/query/react';
import { ENDPOINTS } from 'core/api';
import { EventsSearchRequest, EventsSearchResponse } from 'core/api/types';
import { oktaAuth } from 'core';
import { APIError } from './types';

const { Events } = ENDPOINTS;

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

export const eventsApi = createApi({
  reducerPath: 'eventsApi',
  baseQuery,
  refetchOnMountOrArgChange: true,
  endpoints: (builder) => ({
    eventSearch: builder.mutation<EventsSearchResponse, EventsSearchRequest>({
      query: (body) => ({
        method: 'POST',
        url: Events.search,
        body,
      }),
    }),
  }),
});

export const { useEventSearchMutation } = eventsApi;
