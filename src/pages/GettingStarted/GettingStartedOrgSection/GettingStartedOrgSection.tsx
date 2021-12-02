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
  // required to avoid flickering between changing the loading state for the two requests
  const [showLoader, setShowLoader] = useState(true);

  const { error, data, loading } = useFetch(...getUseHttpConfig(Org.getUserOganizations, { method: 'POST' }, []));
  const { post: postUserCompany, loading: loadingCompany } = useFetch(...getUseHttpConfig());

  const getUserCompany = useCallback(async() => {
    const { name } = await postUserCompany(Org.getUserCompany);

    if (name) {
      setHasOrgIds(true);
    }

    setShowLoader(false);
  }, [postUserCompany]);

  useEffect(() => {
    if (error) {
      toast.error(Messages.orgFetchError);
    }
  }, [error]);

  useEffect(() => {
    if (data?.orgs?.length) {
      setHasOrgIds(true);
      setShowLoader(false);
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
      loading={loading || loadingCompany || showLoader}
      loadingMessage={Messages.loadingOrganization}
    />
  );
};
