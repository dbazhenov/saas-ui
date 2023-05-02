import React, { FC, useCallback, useEffect, useState } from 'react';
import { copyToClipboard, errorHasStatus, useStyles } from 'core';
import { Button, CircularProgress, Link, Alert } from '@mui/material';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { DEFAULT_DATE_LOCALE } from 'core/constants';
import { getStyles } from './ClusterConnected.styles';
import { Messages } from './ClusterConnected.messages';
import { dbaasApi, useLazyGetClusterConfigQuery } from '../DBaaSClusterCreation.service';
import { KubeconfigModal } from './KubeconfigModal/KubeconfigModal';
import { ClusterConnectedProps } from './ClusterConnected.types';
import { CIRCULAR_SIZE, CLUSTER_EXPIRATION_DELAY, DATE_LOCALE_OPTIONS } from './ClusterConnected.constants';

export const ClusterConnected: FC<ClusterConnectedProps> = ({ clusterId, pmmDemoUrl, createdAt }) => {
  const styles = useStyles(getStyles);
  const [isRequestPending, setIsRequestPending] = useState(false);
  const dispatch = useDispatch();
  const [isKubeconfigModalVisible, setIsKubeconfigModalVisible] = useState(false);
  const [expirationDateTime, setExpirationDateTime] = useState(Date.now().toLocaleString());
  const [getConfigTrigger, { data, error, isLoading }] = useLazyGetClusterConfigQuery();

  const handleCopyToClipboard = useCallback(async () => {
    await copyToClipboard(data?.kubeconfig!);
    toast.success(Messages.copySuccessful);
  }, [data]);

  const openModal = () => {
    setIsKubeconfigModalVisible(true);
  };

  const handleKubeconfigModalClose = () => {
    setIsKubeconfigModalVisible(false);
  };

  useEffect(() => {
    if (errorHasStatus(error, 404)) {
      toast.error(Messages.clusterNotFound);
      dispatch(dbaasApi.util.resetApiState());
    }
  }, [dispatch, error]);

  useEffect(() => {
    if (createdAt) {
      const expirationDateTimeUtc = new Date(createdAt).getTime() + CLUSTER_EXPIRATION_DELAY;

      setExpirationDateTime(
        new Date(expirationDateTimeUtc).toLocaleString(DEFAULT_DATE_LOCALE, DATE_LOCALE_OPTIONS),
      );
    }
  }, [createdAt]);

  useEffect(() => {
    const configTrigger = async () => {
      await getConfigTrigger(clusterId);
    };

    if (clusterId) {
      configTrigger();
    }
  }, [clusterId, getConfigTrigger]);

  useEffect(() => {
    setIsRequestPending(isLoading);
  }, [isLoading]);

  return (
    <div data-testid="cluster-connected">
      <Alert
        severity="success"
        className={styles.defaultText}
        action={
          <Link className={styles.goButton} href={pmmDemoUrl} target="_blank">
            {Messages.go}
          </Link>
        }
      >
        {Messages.successfulMessage}
      </Alert>
      <div className={styles.successfulMessageDetails}>
        {isRequestPending ? (
          <div data-testid="cluster-building-loader" className={styles.loader}>
            <CircularProgress color="inherit" size={CIRCULAR_SIZE} />
          </div>
        ) : (
          <div data-testid="cluster-created">
            <div>{Messages.successfulMessageDetails}</div>
            <div>{Messages.clusterSpecifications}</div>
            <div>
              {Messages.availableUntil} {expirationDateTime}
            </div>
          </div>
        )}
      </div>
      <Button className={styles.copyButton} variant="contained" onClick={handleCopyToClipboard}>
        {Messages.copyK8sConfig}
      </Button>
      <Button className={styles.viewConfigLink} onClick={openModal}>
        {Messages.viewKubeconfig}
      </Button>
      <KubeconfigModal
        kubeconfig={data?.kubeconfig!}
        isVisible={isKubeconfigModalVisible}
        onClose={handleKubeconfigModalClose}
      />
    </div>
  );
};
