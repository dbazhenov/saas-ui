import React, { FC, useEffect, useMemo, useState, useCallback, SyntheticEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useStyles } from 'core/utils';
import { toast } from 'react-toastify';

import {
  getFirstOrgId,
  getOrgState,
  searchOrgsAction,
  getOrganizationAction,
  getCurrentOrgTier,
} from 'store/orgs';
import { WelcomeModal } from 'components/WelcomeModal';
import { Tabs, Tab, CircularProgress } from '@mui/material';
import { PrivateLayout } from 'components';
import { AdvisorsTabs } from './Advisors.types';
import { getStyles } from './Advisors.styles';
import { JoinOrganization } from './JoinOrganization';
import { Messages } from './Advisors.messages';
import { TabPanel } from './TabPanel';
import { useGetAdvisorsQuery } from './Advisors.service';
import { WELCOME_MODAL_DISMISSED_STORAGE_KEY } from './Advisors.constants';
import { AdvancedAdvisors } from './AdvancedAdvisors';
import { AdvancedAdvisorsProps } from './AdvancedAdvisors/AdvancedAdvisors.types';

export const AdvisorsPage: FC = () => {
  const styles = useStyles(getStyles);
  const orgId = useSelector(getFirstOrgId);
  const dispatch = useDispatch();
  const { pending } = useSelector(getOrgState);
  const currentOrgTier = useSelector(getCurrentOrgTier);
  const [activeTabIndex, setActiveTabIndex] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<string>(AdvisorsTabs.security.toLowerCase());
  const [isRequestPending, setIsRequestPending] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(true);
  const [advancedAdvisorsCategory, setAdvancedAdvisorsCategory] = useState<
    AdvancedAdvisorsProps[] | undefined
  >();
  let changeTimeout: any;

  const { data: advisorsData, error: advisorsError, isLoading: isGetAdvisorsPending } = useGetAdvisorsQuery();

  const handleModalToggle = () => {
    setIsModalVisible(!isModalVisible);
    localStorage.setItem(WELCOME_MODAL_DISMISSED_STORAGE_KEY, 'true');
  };

  useEffect(() => {
    const modalDismissed = localStorage.getItem(WELCOME_MODAL_DISMISSED_STORAGE_KEY);

    if (modalDismissed === 'true') {
      setIsModalVisible(false);
    }
  }, []);

  const activeTabAdvisors = useMemo(() => {
    if (currentOrgTier === '') {
      return advisorsData?.advisors.anonymous.advisors.filter((f) => f.category === activeTab);
    }

    if (currentOrgTier === 'REGISTERED') {
      return advisorsData?.advisors.registered.advisors.filter((f) => f.category === activeTab);
    }

    if (currentOrgTier === 'PAID') {
      return advisorsData?.advisors.paid.advisors.filter((f) => f.category === activeTab);
    }

    return undefined;
  }, [advisorsData, currentOrgTier, activeTab]);

  useEffect(() => {
    if (currentOrgTier === 'REGISTERED') {
      setAdvancedAdvisorsCategory(
        advisorsData?.advisors.paid.advisors.filter(
          (paid_adv) =>
            paid_adv.category === activeTab &&
            advisorsData?.advisors.registered.advisors.findIndex(
              (reg_adv) => reg_adv.name === paid_adv.name,
            ) === -1,
        ),
      );
    }
  }, [currentOrgTier, activeTab, advisorsData]);

  const tabs = useMemo(
    () => [
      {
        label: Messages.security,
        key: AdvisorsTabs.security,
        content: (
          <div data-testid="security-advisors-tab-content">
            <TabPanel advisors={activeTabAdvisors} />
            {advancedAdvisorsCategory && <AdvancedAdvisors advisors={advancedAdvisorsCategory} />}
          </div>
        ),
      },
      {
        label: Messages.configuration,
        key: AdvisorsTabs.configuration,
        content: (
          <div data-testid="configuration-advisors-tab-content">
            <TabPanel advisors={activeTabAdvisors} />
            {advancedAdvisorsCategory && <AdvancedAdvisors advisors={advancedAdvisorsCategory} />}
          </div>
        ),
      },
      {
        label: Messages.query,
        key: AdvisorsTabs.query,
        content: (
          <div data-testid="query-advisors-tab-content">
            <TabPanel advisors={activeTabAdvisors} />
            {advancedAdvisorsCategory && <AdvancedAdvisors advisors={advancedAdvisorsCategory} />}
          </div>
        ),
      },
      {
        label: Messages.performance,
        key: AdvisorsTabs.performance,
        content: (
          <div data-testid="performance-advisors-tab-content">
            <TabPanel advisors={activeTabAdvisors} />
            {advancedAdvisorsCategory && <AdvancedAdvisors advisors={advancedAdvisorsCategory} />}
          </div>
        ),
      },
    ],
    [activeTabAdvisors, advancedAdvisorsCategory],
  );

  useEffect(() => {
    if (!orgId) {
      dispatch(searchOrgsAction());
    }
  }, [dispatch, orgId]);

  useEffect(() => {
    if (orgId && !currentOrgTier) {
      dispatch(getOrganizationAction(orgId));
    }
  }, [dispatch, orgId, currentOrgTier]);

  // Addding debounce as changing tabs quickly causes memory leak in DataGrid state
  const handleChangeTab = (_: SyntheticEvent, value: number) => {
    clearTimeout(changeTimeout);

    changeTimeout = setTimeout(() => {
      setActiveTabIndex(value);
    }, 200);
  };

  useEffect(() => {
    setActiveTab(tabs[activeTabIndex].key.toLowerCase());
  }, [activeTabIndex, tabs]);

  const ActiveTab = useCallback(
    () => tabs.find((tab) => tab.key.toLowerCase() === activeTab)!.content,
    [tabs, activeTab],
  );

  useEffect(() => {
    setIsRequestPending(isGetAdvisorsPending);
  }, [isGetAdvisorsPending]);

  useEffect(() => {
    if (advisorsError == null) {
      return;
    }

    toast.error(Messages.genericError);
  }, [advisorsError]);

  return (
    <PrivateLayout>
      <div className={styles.pageWrapper}>
        <div className={styles.advisorsWrapper}>
          {orgId === '' && !pending && <JoinOrganization />}

          <div data-testid="advisors-tabs-wrapper" className={styles.tabsWrapper}>
            <Tabs value={activeTabIndex} onChange={handleChangeTab} className={styles.tabs}>
              {tabs.map((tab) => (
                <Tab
                  key={tab.label}
                  className={styles.tabRoot}
                  data-testid={`${tab.label.toLowerCase()}-advisors-tab`}
                  label={tab.label}
                />
              ))}
            </Tabs>
            <WelcomeModal
              onToggle={handleModalToggle}
              isModalVisible={isModalVisible}
              title={Messages.welcomeTitle}
            >
              {Messages.welcomeContent}
            </WelcomeModal>
          </div>
          {isRequestPending ? (
            <span data-testid="advisors-loader" className={styles.loader}>
              <CircularProgress />
            </span>
          ) : (
            <div data-testid="advisors-tab-content">
              <ActiveTab />
            </div>
          )}
        </div>
      </div>
    </PrivateLayout>
  );
};
