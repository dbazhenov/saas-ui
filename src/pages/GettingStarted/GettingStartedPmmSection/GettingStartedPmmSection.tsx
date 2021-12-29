import React, { FC, useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useFetch from 'use-http';
import { toast } from 'react-toastify';
import { Routes } from 'core/routes';
import { ENDPOINTS } from 'core/api';
import { getUseHttpConfig } from 'core/api/api.service';
import { getOrgs } from 'store/orgs/orgs.selectors';
import { orgsGetInventoryAction } from 'store/orgs';
import { Messages } from './GettingStartedPmmSection.messages';
import { GettingStartedSection } from '../GettingStartedSection';
import { READ_MORE_LINK } from './GettingStartedPmmSection.constants';

const { Org } = ENDPOINTS;

export const GettingStartedPmmSection: FC = () => {
  // required to avoid flickering between changing the loading state for the two requests
  const [showLoader, setShowLoader] = useState(true);
  const dispatch = useDispatch();
  const { inventory } = useSelector(getOrgs);

  const { post, error, loading } = useFetch(...getUseHttpConfig());

  const getInventory = useCallback(async () => {
    const { orgs } = await post(Org.getUserOganizations);

    if (orgs?.length) {
      dispatch(orgsGetInventoryAction.request(orgs[0].id));
    }

    setShowLoader(false);
  }, [dispatch, post]);

  useEffect(() => {
    if (error) {
      toast.error(Messages.orgFetchError);
    }
  }, [error]);

  useEffect(() => {
    if (inventory == null) {
      getInventory();
    } else {
      setShowLoader(false);
    }
  }, [inventory, getInventory]);

  return (
    <GettingStartedSection
      description={Messages.connectPMMDescription}
      title={Messages.connectPMMTitle}
      linkTo={Routes.instances}
      linkText={Messages.viewInstances}
      isTicked={!!inventory?.length}
      loading={loading || showLoader}
      disabled={!inventory?.length}
      readMoreLink={READ_MORE_LINK}
    />
  );
};
