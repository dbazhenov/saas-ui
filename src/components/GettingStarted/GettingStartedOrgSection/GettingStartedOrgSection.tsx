import React, { FC, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getFirstOrgId, getIsOrgPending } from 'store/orgs';
import { Routes } from 'core';
import { getUserCompanyName } from 'store/auth';
import { GettingStartedSection } from '../GettingStartedSection';
import { Messages } from './GettingStartedOrgSection.messages';

export const GettingStartedOrgSection: FC = () => {
  const orgId = useSelector(getFirstOrgId);
  const companyName = useSelector(getUserCompanyName);
  const isOrgPending = useSelector(getIsOrgPending);
  const [hasOrg, setHasOrg] = useState<boolean>();

  useEffect(() => {
    setHasOrg(!!(companyName || orgId));
  }, [orgId, companyName]);

  return (
    <GettingStartedSection
      description={Messages.createOrganizationDescription}
      title={Messages.createOrganizationTitle}
      linkIcon={hasOrg ? undefined : 'plus-circle'}
      linkTo={Routes.organization}
      linkText={hasOrg ? Messages.viewOrganization : Messages.addOrganization}
      isTicked={hasOrg}
      loading={isOrgPending}
      loadingMessage={Messages.loadingOrganization}
    />
  );
};
