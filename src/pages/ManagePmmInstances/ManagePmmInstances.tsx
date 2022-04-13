import React, { FC, useEffect } from 'react';
import { useStyles } from '@grafana/ui';
import { useDispatch, useSelector } from 'react-redux';
import { PrivateLayout } from 'components/Layouts';
import { getOrgInventory } from 'store/orgs/orgs.selectors';
import { ReactComponent as PmmInstancesLogo } from 'assets/pmm-server-instances.svg';
import { getFirstOrgId, getInventoryAction, getIsOrgPending, searchOrgsAction } from 'store/orgs';
import { LINKS } from './ManagePmmInstances.constants';
import { getStyles } from './ManagePmmInstances.styles';
import { Messages } from './ManagePmmInstances.messages';
import { PmmInstanceList } from './PmmInstanceList';

export const ManagePmmInstancesPage: FC = () => {
  const styles = useStyles(getStyles);
  const inventory = useSelector(getOrgInventory);
  const orgId = useSelector(getFirstOrgId);
  const loading = useSelector(getIsOrgPending);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!orgId) {
      dispatch(searchOrgsAction());
    }
  }, [dispatch, orgId]);

  useEffect(() => {
    if (inventory == null && orgId) {
      dispatch(getInventoryAction(orgId));
    }
  }, [dispatch, inventory, orgId]);

  return (
    <PrivateLayout>
      <div data-testid="manage-organization-container" className={styles.container}>
        <header data-testid="manage-organization-header">
          <PmmInstancesLogo />
          {Messages.pmmInstances}
        </header>
        <div className={styles.contentWrapper}>
          <div className={styles.linkWrapper}>
            <a className={styles.externalLink} href={LINKS.howToConnectPMM} target="_blank" rel="noreferrer noopener" data-testid="forum-contact-link">
              {Messages.howToLink}
            </a>
          </div>
          <PmmInstanceList
            pmmInstances={inventory || []}
            loading={loading}
          />
        </div>
      </div>
    </PrivateLayout>
  );
};
