import React, { FC, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getFirstOrgId, getIsOrgPending } from 'store/orgs';
import { Add } from '@mui/icons-material';
import { Routes } from 'core';
import { GettingStartedSection } from '../GettingStartedSection';
import { Messages } from './GettingStartedOrgSection.messages';

export const GettingStartedOrgSection: FC = () => {
  const orgId = useSelector(getFirstOrgId);
  const isOrgPending = useSelector(getIsOrgPending);
  const [hasOrg, setHasOrg] = useState<boolean>();

  useEffect(() => {
    setHasOrg(!!orgId);
  }, [orgId]);

  return (
    <GettingStartedSection
      description={Messages.createOrganizationDescription}
      title={Messages.createOrganizationTitle}
      linkIcon={hasOrg ? undefined : <Add />}
      linkTo={Routes.organization}
      linkText={hasOrg ? Messages.viewOrganization : Messages.addOrganization}
      isTicked={hasOrg}
      loading={isOrgPending}
      loadingMessage={Messages.loadingOrganization}
    />
  );
};
