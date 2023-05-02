import React, { FC, useEffect, useState } from 'react';
import { useStyles, errorHasStatus } from 'core/utils';
import { Card, CircularProgress, Link } from '@mui/material';
import FeedIcon from '@mui/icons-material/Feed';
import { useDispatch, useSelector } from 'react-redux';
import { PrivateLayout, WelcomeModal } from 'components';
import { getFirstOrgId, getOrgState, searchOrgsAction } from 'store/orgs';
import { ClusterStatus } from 'core/api/types';
import { getStyles } from './DBaaS.styles';
import { Messages } from './DBaaS.messages';
import { useGetClusterStatusQuery, useCreateClusterMutation, dbaasApi } from './DBaaSClusterCreation.service';
import {
  CIRCULAR_SIZE,
  PMM_DBAAS_DOC_LINK,
  PROGRESS_STATUSES,
  POLLING_INTERVAL,
  WELCOME_MODAL_DISMISSED_STORAGE_KEY,
} from './DBaaS.constants';
import { JoinOrganization } from './JoinOrganization/JoinOrganization';
import { ClusterCreationFailed } from './ClusterCreationFailed';
import { ClusterConnected } from './ClusterConnected';
import { ClusterDefaultStep } from './ClusterDefaultStep';
import { ClusterCreationProgress } from './ClusterCreationProgress';
import { DailyExceededStep } from './DailyExceededStep';

export const DBaaSPage: FC = () => {
  const styles = useStyles(getStyles);
  const [isModalVisible, setIsModalVisible] = useState(true);
  const [isRequestPending, setIsRequestPending] = useState(false);
  const [isClusterLoading, setIsClusterLoading] = useState(false);
  const [pollingInterval, setPollingInterval] = useState(0);
  const [isClusterReady, setIsClusterReady] = useState(false);
  const [isClusterBuilding, setIsClusterBuilding] = useState(false);
  const [isDailyLimitExceeded, setIsDailyLimitExceeded] = useState(false);
  const orgId = useSelector(getFirstOrgId);
  const dispatch = useDispatch();
  const { pending } = useSelector(getOrgState);
  const {
    data: statusData,
    error: statusError,
    isLoading: isStatusLoading,
    isUninitialized: isStatusUninitialized,
  } = useGetClusterStatusQuery(undefined, {
    pollingInterval,
  });

  const { status, failed, clusterId, pmmDemoUrl, createdAt } = statusData ?? {
    status: ClusterStatus.notFound,
    failed: true,
  };

  const [createCluster, { data: createData, isLoading }] = useCreateClusterMutation();

  useEffect(() => {
    if (createData) {
      setPollingInterval(POLLING_INTERVAL);
      setIsClusterBuilding(true);
    }
  }, [createData]);

  useEffect(() => {
    const isBuilding = PROGRESS_STATUSES.has(status);

    const isReady = status === ClusterStatus.connected;

    setIsDailyLimitExceeded(status === ClusterStatus.dailyLimitExceeded);
    setIsClusterReady(isReady);
    setIsClusterBuilding(isBuilding);

    if (isReady || status === ClusterStatus.dailyLimitExceeded || failed === true) {
      setPollingInterval(0);
    }

    if (isBuilding && failed === false) {
      setPollingInterval(POLLING_INTERVAL);
    }
  }, [status, failed]);

  const handleCreateClusterClick = () => {
    createCluster();
  };

  useEffect(() => {
    if (!orgId) {
      dispatch(searchOrgsAction());
    }
  }, [dispatch, orgId]);

  useEffect(() => {
    setIsRequestPending(isStatusLoading);
  }, [isStatusLoading]);

  useEffect(() => {
    setIsClusterLoading(isLoading);
  }, [isLoading]);

  useEffect(() => {
    const modalDismissed = localStorage.getItem(WELCOME_MODAL_DISMISSED_STORAGE_KEY);

    if (modalDismissed === 'true') {
      setIsModalVisible(false);
    }
  }, []);

  const handleModalToggle = () => {
    setIsModalVisible(!isModalVisible);
    localStorage.setItem(WELCOME_MODAL_DISMISSED_STORAGE_KEY, 'true');
  };

  useEffect(() => {
    // the cluster is expired and we need to store that it's no longer active
    if (errorHasStatus(statusError, 404) && !isStatusUninitialized && status === ClusterStatus.connected) {
      // reset the cache and set the query to uninitialized
      dispatch(dbaasApi.util.resetApiState());
    }
  }, [dispatch, status, statusError, isStatusUninitialized]);

  return (
    <PrivateLayout>
      <div className={styles.dbaasWrapper}>
        <div className={styles.pageWrapper}>
          <WelcomeModal
            onToggle={handleModalToggle}
            isModalVisible={isModalVisible}
            title={Messages.welcomeTitle}
          >
            {Messages.welcomeContent}
          </WelcomeModal>
          {orgId === '' && !pending && <JoinOrganization />}
          <div className={styles.contentWrapper}>
            <Card className={styles.card} elevation={4}>
              <div className={styles.stepsContainer}>
                {isDailyLimitExceeded ? (
                  <DailyExceededStep />
                ) : (
                  <div>
                    <div className={styles.title}>{Messages.title}</div>
                    {isRequestPending ? (
                      <div data-testid="cluster-building-loader" className={styles.loader}>
                        <CircularProgress color="inherit" size={CIRCULAR_SIZE} />
                      </div>
                    ) : (
                      (failed === true && (
                        <ClusterCreationFailed
                          isClusterLoading={isClusterLoading}
                          onClick={handleCreateClusterClick}
                        />
                      )) ||
                      (failed === false && isClusterBuilding && (
                        <ClusterCreationProgress status={status} />
                      )) ||
                      (failed === false && isClusterReady && (
                        <ClusterConnected
                          clusterId={clusterId!}
                          pmmDemoUrl={pmmDemoUrl!}
                          createdAt={createdAt!}
                        />
                      )) ||
                      (failed === false && (
                        <ClusterDefaultStep
                          orgId={orgId}
                          onClick={handleCreateClusterClick}
                          isClusterLoading={isClusterLoading}
                        />
                      ))
                    )}
                  </div>
                )}
              </div>
            </Card>
            <Link
              href={PMM_DBAAS_DOC_LINK}
              className={styles.readMoreWrapper}
              data-testid="read-more-link"
              underline="none"
              target="_blank"
            >
              <FeedIcon fontSize="small" className={styles.feedIcon} />
              <span>{Messages.readMore}</span>
            </Link>
          </div>
        </div>
      </div>
    </PrivateLayout>
  );
};
