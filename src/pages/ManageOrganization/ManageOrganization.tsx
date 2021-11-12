import React, { FC, useCallback, useMemo, useEffect, useState } from 'react';
import useFetch from 'use-http';
import { toast } from 'react-toastify';
import { useStyles, Tab, TabsBar, TabContent } from '@grafana/ui';
import { getUseHttpConfig } from 'core/api/api.service';
import { PrivateLayout } from 'components/Layouts';
import { ReactComponent as OrganizationLogo } from 'assets/organization.svg';
import { useUserRole } from 'core/hooks';
import { Messages } from './ManageOrganization.messages';
import { getStyles } from './ManageOrganization.styles';
import { formatMembers } from './ManageOrganization.utils';
import { CreateOrganizationPayload, Member, MemberRole, InviteMemberFormFields } from './ManageOrganization.types';
import { DEFAULT_TAB_INDEX, GET_USER_ORGS_URL, ORGANIZATIONS_URL, GET_MEMBERS_URL_CHUNK, ORGANIZATION_MEMBER_URL_CHUNK } from './ManageOrganization.constants';
import { OrganizationView } from './OrganizationView';
import { OrganizationCreate } from './OrganizationCreate';
import { InviteMember } from './InviteMember';
import { MembersList } from './MembersList';

export const ManageOrganizationPage: FC = () => {
  const styles = useStyles(getStyles);
  const [orgId, setOrgId] = useState<string>();
  const [orgMembers, setOrgMembers] = useState<Member[]>([]);
  const [userIsAdmin, setUserIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState(DEFAULT_TAB_INDEX);
  const [userRole] = useUserRole(orgId);
  const fetchConfig = getUseHttpConfig();
  const { response, error, loading, post, data = {} } = useFetch(...fetchConfig);

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
  }, [post, orgId]);

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
                <OrganizationView orgId={orgId} />
              </div>
            ) : (
              <div data-testid="create-organization">
                <OrganizationCreate onCreateOrgSubmit={handleCreateOrgSubmit} loading={loading} />
              </div>
            )}
        </div>
      ),
    },
  ], [handleCreateOrgSubmit, handleInviteMemberSubmit, loading, orgId, orgMembers, userIsAdmin]);

  useEffect(() => {
    const getOrgs = async () => {
      await post(GET_USER_ORGS_URL);
    };

    getOrgs();
  }, [post]);

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
        <div data-testid="manage-organization-tabs-wrapper" className={styles.tabsWrapper}>
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
            {tabs[activeTab].content}
          </TabContent>
        </div>
      </div>
    </PrivateLayout>
  );
};
