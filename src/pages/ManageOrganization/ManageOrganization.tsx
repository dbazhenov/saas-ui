import React, { FC, useCallback, useMemo, useEffect, useState } from 'react';
import useFetch from 'use-http';
import { toast } from 'react-toastify';
import { cx } from 'emotion';
import { useStyles, Tab, TabsBar, TabContent, Spinner } from '@grafana/ui';
import { getUseHttpConfig } from 'core/api/api.service';
import { ENDPOINTS } from 'core/api';
import { PrivateLayout } from 'components/Layouts';
import { ReactComponent as OrganizationLogo } from 'assets/organization.svg';
import { useUserRole, useUserInfo } from 'core/hooks';
import { Messages } from './ManageOrganization.messages';
import { getStyles } from './ManageOrganization.styles';
import { formatMembers } from './ManageOrganization.utils';
import { CreateOrganizationPayload, Member, MemberRole, InviteMemberFormFields, EditMemberPayload } from './ManageOrganization.types';
import { DEFAULT_TAB_INDEX, GET_USER_ORGS_URL, ORGANIZATIONS_URL, GET_MEMBERS_URL_CHUNK, ORGANIZATION_MEMBER_URL_CHUNK } from './ManageOrganization.constants';
import { OrganizationView } from './OrganizationView';
import { OrganizationCreate } from './OrganizationCreate';
import { InviteMember } from './InviteMember';
import { MembersList } from './MembersList';
import { ManageOrganizationProvider } from './ManageOrganization.provider';

const { Org } = ENDPOINTS;

export const ManageOrganizationPage: FC = () => {
  const styles = useStyles(getStyles);
  const [orgId, setOrgId] = useState<string>();
  const [orgMembers, setOrgMembers] = useState<Member[]>([]);
  const [userIsAdmin, setUserIsAdmin] = useState(false);
  const [fromCustomerPortal, setFromCustomerPortal] = useState(false);
  const [activeTab, setActiveTab] = useState(DEFAULT_TAB_INDEX);
  // required to avoid flickering between changing the loading state
  const [showLoader, setShowLoader] = useState(true);
  const [userRole, loadingUserRole] = useUserRole(orgId);
  const [userInfo] = useUserInfo();
  const fetchConfig = getUseHttpConfig();
  const { response, error, loading, post, put, data } = useFetch(...fetchConfig);
  const { post: postUserCompany, loading: loadingCompany } = useFetch(...fetchConfig);
  const tabsWrapperStyles = cx({
    [styles.tabsWrapper]: true,
    [styles.tabsWrapperLoading]: showLoader || loading || loadingCompany || loadingUserRole,
  });

  useEffect(() => {
    setUserIsAdmin(userRole === MemberRole.admin);
  }, [userRole, orgMembers]);

  const handleCreateOrgSubmit = useCallback(async ({ organizationName }: CreateOrganizationPayload) => {
    const { org } = await post(ORGANIZATIONS_URL, { name: organizationName });

    if (org?.id && response.ok) {
      toast.success(Messages.orgCreateSuccess);
      setOrgId(org?.id);
    }
  }, [post, response.ok]);

  const getOrgMembers = useCallback(async () => {
    const { members } = await post(`${ORGANIZATIONS_URL}/${orgId}/${GET_MEMBERS_URL_CHUNK}`);

    setOrgMembers(formatMembers(members));
    setShowLoader(false);
  }, [post, orgId]);

  const getUserCompany = useCallback(async() => {
    const { name } = await postUserCompany(Org.getUserCompany);

    // add org to orgd with the name of the company found in ServiceNow
    if (name) {
      const { org } = await post(ORGANIZATIONS_URL, { name });

      if (org?.id) {
        setOrgId(org?.id);
        setFromCustomerPortal(true);
      }
    }

    setShowLoader(false);
  }, [post, postUserCompany]);

  const handleInviteMemberSubmit = useCallback(async ({ email, role }: InviteMemberFormFields) => {
    await post(`${ORGANIZATIONS_URL}/${orgId}/${ORGANIZATION_MEMBER_URL_CHUNK}`, {
      username: email,
      role: role.value,
    });

    if (response.ok) {
      toast.success(Messages.inviteMemberSuccess);
      getOrgMembers();
    }
  }, [post, orgId, getOrgMembers, response.ok]);

  const handleEditMemberSubmit = useCallback(async ({ role, memberId }: EditMemberPayload) => {
    await put(`${ORGANIZATIONS_URL}/${orgId}/${ORGANIZATION_MEMBER_URL_CHUNK}/${memberId}`, {
      role: role.value,
    });

    if (response.ok) {
      toast.success(Messages.inviteMemberSuccess);
      getOrgMembers();
    }
  }, [put, orgId, getOrgMembers, response.ok]);

  const tabs = useMemo(() => [
    {
      label: Messages.members,
      disabled: !orgId,
      content: (
        <div data-testid="manage-organization-members-tab">
          {userIsAdmin && (
            <InviteMember onInviteMemberSubmit={handleInviteMemberSubmit} loading={loading} />
          )}
          <MembersList members={orgMembers} loading={loading} />
        </div>
      ),
    },
    {
      label: Messages.organization,
      disabled: false,
      content: (
        <div data-testid="manage-organization-organization-tab">
          {orgId
            ? (
              <div data-testid="view-organization">
                <OrganizationView orgId={orgId} fromCustomerPortal={fromCustomerPortal} />
              </div>
            ) : (
              <div data-testid="create-organization">
                <OrganizationCreate
                  onCreateOrgSubmit={handleCreateOrgSubmit}
                  loading={loading || loadingCompany}
                />
              </div>
            )}
        </div>
      ),
    },
  ],
  [
    handleCreateOrgSubmit,
    handleInviteMemberSubmit,
    loading,
    loadingCompany,
    orgId,
    orgMembers,
    userIsAdmin,
    fromCustomerPortal,
  ]);

  useEffect(() => {
    const getOrgs = async () => {
      const { orgs } = await post(GET_USER_ORGS_URL);

      // if there are no orgs check for a linked company in ServiceNow
      if (!orgs || !orgs.length) {
        getUserCompany();
      }
    };

    getOrgs();
  }, [post, getUserCompany]);

  useEffect(() => {
    if (error) {
      toast.error(data?.message ? data.message : Messages.fetchError);
    }

    if (data?.orgs?.length) {
      setOrgId(data?.orgs[0].id);
      setActiveTab(tabs.findIndex((tab) => tab.label === Messages.members));
    }
  }, [error, data, tabs]);

  useEffect(() => {
    if (orgId) {
      getOrgMembers();
    }
  }, [getOrgMembers, orgId]);

  return (
    <PrivateLayout>
      <div data-testid="manage-organization-container" className={styles.container}>
        <header data-testid="manage-organization-header">
          <OrganizationLogo />
          {Messages.manageOrganization}
        </header>
        <div data-testid="manage-organization-tabs-wrapper" className={tabsWrapperStyles}>
          {showLoader || loading || loadingCompany || loadingUserRole ? (
            <Spinner />
          ) : (
            <>
              <TabsBar>
                {tabs.map((tab, index) => (
                  <span key={tab.label} className={tab.disabled ? styles.disabledTab : undefined}>
                    <Tab
                      // TODO: research why css prop is needed and how to remove it
                      active={index === activeTab}
                      css={undefined}
                      data-testid="manage-organization-tab"
                      label={tab.label}
                      onChangeTab={() => setActiveTab(index)}
                    />
                  </span>
                ))}
              </TabsBar>
              <TabContent data-testid="manage-organization-tab-content">
                <ManageOrganizationProvider.Provider
                  value={{
                    onEditMemberSubmit: handleEditMemberSubmit,
                    loading,
                    userInfo,
                    userRole,
                  }}
                >
                  {tabs[activeTab].content}
                </ManageOrganizationProvider.Provider>
              </TabContent>
            </>
          )}
        </div>
      </div>
    </PrivateLayout>
  );
};
