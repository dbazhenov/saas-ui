import { ClusterStatus } from 'core/api/types';

export const PMM_DBAAS_DOC_LINK = 'https://docs.percona.com/percona-monitoring-and-management/index.html';

export const POLLING_INTERVAL = 5000;

export const CIRCULAR_SIZE = 19;

export const CLUSTER_EXPIRATION_DELAY = 10800000; // 3 hours

export const WELCOME_MODAL_DISMISSED_STORAGE_KEY = 'DBaaSWelcomeModalDismissed';

export const PROGRESS_STATUSES = new Set([
  ClusterStatus.clusterCreated,
  ClusterStatus.clusterReady,
  ClusterStatus.pmmReady,
  ClusterStatus.environmentUpdated,
  ClusterStatus.environmentReady,
  ClusterStatus.publicDomainSet,
  ClusterStatus.settingsUpdated,
]);
