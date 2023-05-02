import { createApi, fetchBaseQuery, BaseQueryFn, FetchArgs } from '@reduxjs/toolkit/query/react';
import { ENDPOINTS } from 'core/api';
import { oktaAuth } from 'core';
import {
  CreateClusterResponse,
  CreateClusterResponseData,
  GetClusterStatusResponse,
  GetClusterStatusResponseData,
  GetClusterConfigResponse,
} from 'core/api/types';
import { ClusterStatusError } from './DBaaS.types';

const { DBaaS } = ENDPOINTS;

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
}) as BaseQueryFn<string | FetchArgs, unknown, ClusterStatusError, {}>;

export const dbaasApi = createApi({
  reducerPath: 'dbaasApi',
  baseQuery,
  refetchOnMountOrArgChange: true,
  endpoints: (builder) => ({
    createCluster: builder.mutation<CreateClusterResponseData, void>({
      query: () => ({
        method: 'POST',
        url: DBaaS.clusterCreate,
      }),
      transformResponse: (response: CreateClusterResponse) => ({
        clusterId: response.cluster_id,
      }),
    }),
    getClusterStatus: builder.query<GetClusterStatusResponseData, void>({
      query: () => ({
        url: DBaaS.clusterGetStatus,
      }),
      transformResponse: (response: GetClusterStatusResponse) => ({
        clusterId: response.cluster_id,
        status: response.status,
        createdAt: response.created_at,
        failed: response.failed,
        pmmDemoUrl: response.pmm_demo_url,
        dailyLimitEndsAt: response.daily_limit_ends_at,
      }),
    }),
    getClusterConfig: builder.query<GetClusterConfigResponse, string>({
      query: (clusterId: string) => ({
        url: DBaaS.clusterGetConfig(clusterId),
      }),
    }),
  }),
});

export const { useCreateClusterMutation, useGetClusterStatusQuery, useLazyGetClusterConfigQuery } = dbaasApi;
