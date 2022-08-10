import { K8sClusterStatus } from 'core/api/types';

export interface KubernetesState {
  clusterId: string | null;
  status: K8sClusterStatus | null;
  config: string | null;
  isPending: boolean;
}

export interface GetK8sClusterStatusActionResponse {
  clusterId: string;
  status: K8sClusterStatus;
}
