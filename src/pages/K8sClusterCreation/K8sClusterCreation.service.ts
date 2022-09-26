import { createApi, fetchBaseQuery, BaseQueryFn, FetchArgs } from '@reduxjs/toolkit/query/react';
import { ENDPOINTS } from 'core/api';
import { oktaAuth } from 'core';
import {
  CreateK8sClusterResponse,
  CreateK8sClusterResponseData,
  GetK8sClusterStatusResponse,
  GetK8sClusterStatusResponseData,
  GetK8sClusterConfigResponse,
} from 'core/api/types';
import { K8sClusterStatusError } from './K8sClusterCreation.types';

const { Kubernetes } = ENDPOINTS;

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
}) as BaseQueryFn<string | FetchArgs, unknown, K8sClusterStatusError, {}>;

export const kubernetesApi = createApi({
  reducerPath: 'kubernetesApi',
  baseQuery,
  refetchOnMountOrArgChange: true,
  endpoints: (builder) => ({
    createCluster: builder.mutation<CreateK8sClusterResponseData, void>({
      query: () => ({
        method: 'POST',
        url: Kubernetes.k8sClusterCreate,
      }),
      transformResponse: (response: CreateK8sClusterResponse) => ({
        clusterId: response.cluster_id,
      }),
    }),
    getClusterStatus: builder.query<GetK8sClusterStatusResponseData, void>({
      query: () => ({
        url: Kubernetes.k8sClusterGetStatus,
      }),
      transformResponse: (response: GetK8sClusterStatusResponse) => ({
        clusterId: response.cluster_id,
        status: response.status,
        createdAt: response.created_at,
      }),
    }),
    getClusterConfig: builder.query<GetK8sClusterConfigResponse, string>({
      query: (clusterId: string) => ({
        url: Kubernetes.k8sClusterGetConfig(clusterId),
      }),
    }),
  }),
});

export const { useCreateClusterMutation, useGetClusterStatusQuery, useLazyGetClusterConfigQuery } =
  kubernetesApi;
