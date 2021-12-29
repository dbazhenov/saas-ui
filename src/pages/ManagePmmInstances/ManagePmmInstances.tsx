import React, { FC, useCallback, useEffect, useState } from 'react';
import { useStyles } from '@grafana/ui';
import useFetch from 'use-http';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { PrivateLayout } from 'components/Layouts';
import { ENDPOINTS } from 'core/api';
import { getUseHttpConfig } from 'core/api/api.service';
import { getOrgs } from 'store/orgs/orgs.selectors';
import { ReactComponent as PmmInstancesLogo } from 'assets/pmm-server-instances.svg';
import { orgsGetInventoryAction } from 'store/orgs';
import { getStyles } from './ManagePmmInstances.styles';
import { Messages } from './ManagePmmInstances.messages';
import { PmmInstanceList } from './PmmInstanceList';

const { Org } = ENDPOINTS;

export const ManagePmmInstancesPage: FC = () => {
  const [showLoader, setShowLoader] = useState(true);
  const styles = useStyles(getStyles);
  const { inventory } = useSelector(getOrgs);
  const dispatch = useDispatch();

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
    <PrivateLayout>
      <div data-testid="manage-organization-container" className={styles.container}>
        <header data-testid="manage-organization-header">
          <PmmInstancesLogo />
          {Messages.pmmInstances}
        </header>
        <div className={styles.contentWrapper}>
          <PmmInstanceList
            pmmInstances={inventory || []}
            loading={loading || showLoader || inventory == null}
          />
        </div>
      </div>
    </PrivateLayout>
  );
};
