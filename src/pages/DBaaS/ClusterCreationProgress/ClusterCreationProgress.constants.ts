import { ClusterStatus } from 'core/api/types';

export const PROGRESS_STATUSES_SEQUENCE = [
  ClusterStatus.clusterCreated,
  ClusterStatus.clusterReady,
  ClusterStatus.pmmReady,
  ClusterStatus.environmentUpdated,
  ClusterStatus.environmentReady,
  ClusterStatus.publicDomainSet,
  ClusterStatus.settingsUpdated,
  ClusterStatus.connected,
];
