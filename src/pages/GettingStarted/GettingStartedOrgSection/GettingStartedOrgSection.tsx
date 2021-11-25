import React, { FC, useCallback, useEffect, useState } from 'react';
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

  const { error, data, loading } = useFetch(...getUseHttpConfig(Org.getUserOganizations, { method: 'POST' }, []));
  const { post: postUserCompany, loading: loadingCompany } = useFetch(...getUseHttpConfig());

  const getUserCompany = useCallback(async() => {
    const { name } = await postUserCompany(Org.getUserCompany);

    if (name) {
      setHasOrgIds(true);
    }
  }, [postUserCompany]);

  useEffect(() => {
    if (error) {
      toast.error(Messages.orgFetchError);
    }
  }, [error]);

  useEffect(() => {
    if (data?.orgs?.length) {
      setHasOrgIds(true);
    }

    if (data && (!data?.orgs || !data?.orgs?.length)) {
      getUserCompany();
    }
  }, [data, getUserCompany]);

  return (
    <GettingStartedSection
      description={Messages.createOrganizationDescription}
      title={Messages.createOrganizationTitle}
      linkIcon={hasOrgIds ? undefined : 'plus-circle'}
      linkTo={Routes.organization}
      linkText={hasOrgIds ? Messages.viewOrganization : Messages.addOrganization}
      isTicked={hasOrgIds}
      disabled={loading || loadingCompany}
    />
  );
};
