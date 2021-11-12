import React, { FC, useEffect, useState } from 'react';
import useFetch from 'use-http';
import { toast } from 'react-toastify';
import { Routes } from 'core/routes';
import { ENDPOINTS } from 'core/api';
import { getUseHttpConfig } from 'core/api/api.service';
import { Messages } from './GettingStartedOrgSection.messages';
import { GettingStartedSection } from '../GettingStartedSection';

const { Org } = ENDPOINTS;

export const GettingStartedOrgSection: FC = () => {
  const [hasOrgIds, setHasOrgIds] = useState(false);

  const { error, data = {} } = useFetch(...getUseHttpConfig(Org.getUserOganizations, { method: 'POST' }, []));

  useEffect(() => {
    if (error) {
      toast.error(Messages.orgFetchError);
    }
  }, [error]);

  useEffect(() => {
    if (data?.orgs?.length) {
      setHasOrgIds(true);
    }
  }, [data]);

  return (
    <GettingStartedSection
      description={Messages.createOrganizationDescription}
      title={Messages.createOrganizationTitle}
      linkIcon={hasOrgIds ? undefined : 'plus-circle'}
      linkTo={Routes.organization}
      linkText={hasOrgIds ? Messages.viewOrganization : Messages.addOrganization}
      isTicked={hasOrgIds}
    />
  );
};
