import { Api, ENDPOINTS } from 'core/api';
import { CreateClusterResponse, GetClusterStatusResponse, GetClusterConfigResponse } from './types';

const { DBaaS } = ENDPOINTS;

export const createCluster = () => Api.post<{}, CreateClusterResponse>(DBaaS.clusterCreate, {});

export const getClusterStatus = () => Api.get<{}, GetClusterStatusResponse>(DBaaS.clusterGetStatus, {});

export const getClusterConfig = (clusterId: string) =>
  Api.get<{}, GetClusterConfigResponse>(DBaaS.clusterGetConfig(clusterId), {});
