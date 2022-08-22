import { createApi, fetchBaseQuery, BaseQueryFn, FetchArgs } from '@reduxjs/toolkit/query/react';
import { ENDPOINTS } from 'core/api';
import { oktaAuth } from 'core';
import { MembersListStatusError, ResendEmailData } from './MembersList.types';

const { Org } = ENDPOINTS;

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
}) as BaseQueryFn<string | FetchArgs, unknown, MembersListStatusError, {}>;

export const membersListApi = createApi({
  reducerPath: 'membersListApi',
  baseQuery,
  refetchOnMountOrArgChange: true,
  endpoints: (builder) => ({
    createResendEmail: builder.mutation<void, ResendEmailData>({
      query: ({ organizationId, memberId }: ResendEmailData) => ({
        method: 'POST',
        url: Org.resendEmail(organizationId, memberId),
        body: { organizationId, memberId },
      }),
    }),
  }),
});

export const { useCreateResendEmailMutation } = membersListApi;
