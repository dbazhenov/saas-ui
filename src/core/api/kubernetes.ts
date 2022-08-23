import { Api, ENDPOINTS } from 'core/api';
import { CreateK8sClusterResponse, GetK8sClusterStatusResponse, GetK8sClusterConfigResponse } from './types';

const { Kubernetes } = ENDPOINTS;

export const createK8sCluster = () => Api.post<{}, CreateK8sClusterResponse>(Kubernetes.k8sClusterCreate, {});

export const getK8sClusterStatus = () =>
  Api.get<{}, GetK8sClusterStatusResponse>(Kubernetes.k8sClusterGetStatus, {});

export const getK8sClusterConfig = (clusterId: string) =>
  Api.get<{}, GetK8sClusterConfigResponse>(Kubernetes.k8sClusterGetConfig(clusterId), {});
