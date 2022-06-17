import React, { FC, useCallback, useMemo, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { cx } from 'emotion';
import { useStyles, Tab, TabsBar, TabContent, Spinner } from '@grafana/ui';
import { PrivateLayout } from 'components/Layouts';
import { ReactComponent as OrganizationLogo } from 'assets/organization.svg';
import { getIsUserPending, getUserCompanyAction, getUserCompanyName } from 'store/auth';
import {
  getFirstOrgId,
  getIsOrgPending,
  getIsUserAdmin,
  getOrgMembers,
  getOrgs,
  getIsOrgEditing,
  createServiceNowOrganizationAction,
  getUserRoleAction,
  getOrgViewActiveTab,
  setOrgViewActiveTab,
} from 'store/orgs';
import { OrganizationViewTabs } from 'store/types/orgs';
import { Messages } from './ManageOrganization.messages';
import { getStyles } from './ManageOrganization.styles';
import { OrganizationView } from './OrganizationView';
import { OrganizationCreate } from './OrganizationCreate';
import { OrganizationEdit } from './OrganizationEdit';
import { InviteMember } from './InviteMember';
import { MembersList } from './MembersList';

export const ManageOrganizationPage: FC = () => {
  const styles = useStyles(getStyles);
  const dispatch = useDispatch();
  const orgId = useSelector(getFirstOrgId);
  const isUserAdmin = useSelector(getIsUserAdmin);
  const isUserPending = useSelector(getIsUserPending);
  const isOrgPending = useSelector(getIsOrgPending);
  const orgs = useSelector(getOrgs);
  const members = useSelector(getOrgMembers);
  const companyName = useSelector(getUserCompanyName);
  const isOrgEditing = useSelector(getIsOrgEditing);
  const activeTab = useSelector(getOrgViewActiveTab);
  const [activeTabIndex, setActiveTabIndex] = useState<number>();
  const tabsWrapperStyles = cx({
    [styles.tabsWrapper]: true,
    [styles.tabsWrapperLoading]: isOrgPending || isUserPending,
  });
  const [hasOrg, setHasOrg] = useState<boolean>();

  useEffect(() => {
    setHasOrg(!!(companyName || orgId));
  }, [orgId, companyName]);

  const orgTabContent = useMemo(() => {
    if (hasOrg && !isOrgEditing) {
      return (
        <div data-testid="view-organization">
          <OrganizationView />
        </div>
      );
    }

    if (hasOrg && isOrgEditing) {
      return (
        <div data-testid="edit-organization">
          <OrganizationEdit loading={isOrgPending || isUserPending} />
        </div>
      );
    }

    return (
      <div data-testid="create-organization">
        <OrganizationCreate loading={isOrgPending || isUserPending} />
      </div>
    );
  }, [hasOrg, isOrgEditing, isOrgPending, isUserPending]);

  const tabs = useMemo(
    () => [
      {
        label: Messages.members,
        key: OrganizationViewTabs.members,
        disabled: !members.length,
        content: (
          <div data-testid="manage-organization-members-tab">
            {isUserAdmin && <InviteMember />}
            <MembersList />
          </div>
        ),
      },
      {
        label: Messages.organization,
        key: OrganizationViewTabs.organization,
        disabled: false,
        content: <div data-testid="manage-organization-organization-tab">{orgTabContent}</div>,
      },
    ],
    [members.length, isUserAdmin, orgTabContent],
  );

  useEffect(() => {
    if (!members.length) {
      // XXX: this action includes searchOrgsAction, that's why it's not dispatched separately
      //      consider to improve that
      dispatch(getUserRoleAction());
    }
  }, [dispatch, members.length]);

  useEffect(() => {
    if (!companyName) {
      dispatch(getUserCompanyAction());
    }
  }, [dispatch, companyName]);

  useEffect(() => {
    // if there are no orgs check for a linked company in ServiceNow
    // and add the org to orgd with the name of the company found in ServiceNow
    if (!orgs.length && !orgId && companyName) {
      dispatch(createServiceNowOrganizationAction(companyName));
    }
  }, [dispatch, orgId, orgs.length, companyName]);

  useEffect(() => {
    setActiveTabIndex(tabs.findIndex((tab) => tab.key === activeTab));
  }, [tabs, activeTab]);

  const changeActiveTab = useCallback(
    (index: number) => {
      dispatch(setOrgViewActiveTab(tabs[index].key));
    },
    [dispatch, tabs],
  );

  const ActiveTab = useCallback(() => tabs.find((tab) => tab.key === activeTab)!.content, [tabs, activeTab]);

  return (
    <PrivateLayout>
      <div data-testid="manage-organization-container" className={styles.container}>
        <header data-testid="manage-organization-header">
          <OrganizationLogo />
          {Messages.manageOrganization}
        </header>
        <div data-testid="manage-organization-tabs-wrapper" className={tabsWrapperStyles}>
          {isOrgPending || isUserPending ? (
            <Spinner />
          ) : (
            <>
              <TabsBar>
                {tabs.map((tab, index) => (
                  <span key={tab.label} className={cx({ [styles.disabledTab]: tab.disabled })}>
                    <Tab
                      // TODO: research why css prop is needed and how to remove it => upgrade Grafana
                      active={index === activeTabIndex}
                      css={undefined}
                      data-testid="manage-organization-tab"
                      label={tab.label}
                      onChangeTab={() => changeActiveTab(index)}
                    />
                  </span>
                ))}
              </TabsBar>
              <TabContent data-testid="manage-organization-tab-content">
                <ActiveTab />
              </TabContent>
            </>
          )}
        </div>
      </div>
    </PrivateLayout>
  );
};
