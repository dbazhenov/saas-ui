import React, { FC, useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import CircularProgress from '@mui/material/CircularProgress';
import LoadingButton from '@mui/lab/LoadingButton';
import { Button, Link } from '@mui/material';
import { PrivateLayout } from 'components/Layouts';
import { ReactComponent as KubernetesLogo } from 'assets/percona-sidebar-k8s.svg';
import { DEFAULT_DATE_LOCALE } from 'core/constants';
import { errorHasStatus, useStyles } from 'core/utils';
import { K8sClusterStatus } from 'core/api/types';

import {
  useCreateClusterMutation,
  useGetClusterStatusQuery,
  useLazyGetClusterConfigQuery,
  kubernetesApi,
} from './K8sClusterCreation.service';
import { getStyles } from './K8sClusterCreation.styles';
import { Messages } from './K8sClusterCreation.messages';
import { KubeconfigModal } from './KubeconfigModal';
import {
  DATE_LOCALE_OPTIONS,
  POLLING_INTERVAL,
  PMM_DBAAS_DOC_LINK,
  OPERATORS_DOC_LINK,
  CLUSTER_EXPIRATION_DELAY,
} from './K8sClusterCreation.constants';
import { CIRCULAR_SIZE } from './KubeconfigModal/KuberconfigModal.constants';

export const K8sClusterCreationPage: FC = () => {
  const styles = useStyles(getStyles);
  const dispatch = useDispatch();
  const [isKubeconfigModalVisible, setIsKubeconfigModalVisible] = useState(false);
  const [pollingInterval, setPollingInterval] = useState(0);
  const [clusterReady, setClusterReady] = useState(false);
  const [isClusterBuilding, setClusterBuilding] = useState(false);
  const [isRequestPending, setIsRequestPending] = useState(false);
  let expirationDateTime = '';

  const {
    data: statusData,
    error: statusError,
    isLoading: isGetClusterStatusPending,
    isUninitialized: isStatusUninitialized,
  } = useGetClusterStatusQuery(undefined, {
    pollingInterval,
  });

  if (statusData?.createdAt) {
    const expirationDateTimeUtc = new Date(statusData.createdAt).getTime() + CLUSTER_EXPIRATION_DELAY;

    expirationDateTime = new Date(expirationDateTimeUtc).toLocaleString(
      DEFAULT_DATE_LOCALE,
      DATE_LOCALE_OPTIONS,
    );
  }

  const [getConfigTrigger, { data: configData, error: configError, isLoading: isGetClusterConfigPending }] =
    useLazyGetClusterConfigQuery();

  const [createCluster, { data: createData, isLoading: isCreateClusterPending, error: createError }] =
    useCreateClusterMutation();

  useEffect(() => {
    if (
      errorHasStatus(statusError, 404) &&
      !isStatusUninitialized &&
      statusData?.status === K8sClusterStatus.active
    ) {
      dispatch(kubernetesApi.util.resetApiState());
    }
  }, [dispatch, statusData, statusError, isStatusUninitialized]);

  useEffect(() => {
    if (errorHasStatus(configError, 404) && !isStatusUninitialized) {
      setIsKubeconfigModalVisible(false);
      toast.error(Messages.clusterNotFound);
      setClusterReady(false);
      dispatch(kubernetesApi.util.resetApiState());
    }
  }, [dispatch, configError, isStatusUninitialized]);

  useEffect(() => {
    if (createData) {
      setPollingInterval(POLLING_INTERVAL);
      setClusterBuilding(true);
    }
  }, [createData]);

  useEffect(() => {
    if (createError == null) {
      return;
    }

    if (errorHasStatus(createError, 403)) {
      toast.error(Messages.quotaReached);
    } else {
      toast.error(Messages.genericError);
    }
  }, [createError]);

  useEffect(() => {
    const isBuilding = statusData?.status === K8sClusterStatus.building;

    setClusterReady(statusData?.status === K8sClusterStatus.active);
    setClusterBuilding(isBuilding);

    if (statusData?.status === K8sClusterStatus.active) {
      setPollingInterval(0);
    }

    if (isBuilding) {
      setPollingInterval(POLLING_INTERVAL);
    }
  }, [statusData]);

  useEffect(() => {
    setIsRequestPending(isGetClusterConfigPending || isGetClusterStatusPending || isCreateClusterPending);
  }, [isGetClusterConfigPending, isGetClusterStatusPending, isCreateClusterPending]);

  const handleCreateClusterClick = () => {
    createCluster();
  };

  const handleGetConfigClick = useCallback(async () => {
    if (statusData == null) {
      toast.error(Messages.genericError);
    } else {
      await getConfigTrigger(statusData.clusterId);
      setIsKubeconfigModalVisible(true);
    }
  }, [statusData, getConfigTrigger]);

  const handleKubeconfigModalClose = () => {
    setIsKubeconfigModalVisible(false);
  };

  return (
    <PrivateLayout>
      <div className={styles.pageWrapper}>
        <header data-testid="kubernetes-header">
          <KubernetesLogo />
          {Messages.title}
        </header>
        <div className={styles.contentWrapper}>
          <p className={styles.description}>{Messages.description}</p>
          {(isStatusUninitialized || isRequestPending || isClusterBuilding) && (
            <span data-testid="kubernetes-cluster-building-loader">
              <CircularProgress color="inherit" className={styles.loader} size={CIRCULAR_SIZE} />
            </span>
          )}
          {!isRequestPending && !isClusterBuilding && clusterReady && (
            <Button
              className={styles.getConfigLink}
              onClick={handleGetConfigClick}
              data-testid="kubernetes-show-config-link"
              size="large"
            >
              {Messages.downloadConfig}
            </Button>
          )}
          {!isStatusUninitialized && !isRequestPending && !isClusterBuilding && !clusterReady && (
            <LoadingButton
              className={styles.createClusterButton}
              data-testid="kubernetes-create-cluster-button"
              variant="contained"
              size="large"
              loading={isCreateClusterPending || isClusterBuilding}
              disabled={(statusData?.status == null && statusError == null) || isRequestPending}
              onClick={handleCreateClusterClick}
            >
              {Messages.createCluster}
            </LoadingButton>
          )}
          {isClusterBuilding && <p className={styles.loadingMessage}>{Messages.loading}</p>}
          {!isRequestPending && !isClusterBuilding && clusterReady && (
            <p>
              {Messages.clusterExpirationTimestamp}
              <span data-testid="kubernetes-cluster-expiration-datetime">{expirationDateTime}</span>
            </p>
          )}
          <p className={styles.details}>{Messages.details}</p>
          <p className={styles.learnMore}>{Messages.learnMore}</p>
          <ul className={styles.learnMoreLinks}>
            <li>
              <Link
                className={styles.learnMoreLink}
                href={PMM_DBAAS_DOC_LINK}
                target="_blank"
                data-testid="install-pmm-with-dbaas"
              >
                {Messages.pmmDbaas}
              </Link>
            </li>
            <li>
              <Link
                className={styles.learnMoreLink}
                href={OPERATORS_DOC_LINK}
                target="_blank"
                data-testid="operators-documentation"
              >
                {Messages.operatorsDoc}
              </Link>
            </li>
          </ul>
          <section className={styles.specsWrapper}>
            <header>{Messages.specsHeader}</header>
            <p>{Messages.specs}</p>
          </section>
        </div>
      </div>
      <KubeconfigModal
        kubeconfig={configData?.kubeconfig!}
        isVisible={isKubeconfigModalVisible}
        onClose={handleKubeconfigModalClose}
      />
    </PrivateLayout>
  );
};
