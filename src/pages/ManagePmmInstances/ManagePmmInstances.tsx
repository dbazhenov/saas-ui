import React, { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PrivateLayout } from 'components/Layouts';
import { getOrgInventory } from 'store/orgs/orgs.selectors';
import { useStyles } from 'core/utils';
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
      <div data-testid="manage-instances-container" className={styles.container}>
        <div className={styles.contentWrapper}>
          <div className={styles.linkWrapper}>
            <a
              className={styles.externalLink}
              href={LINKS.howToConnectPMM}
              target="_blank"
              rel="noreferrer noopener"
              data-testid="connect-pmm-link"
            >
              {Messages.howToLink}
            </a>
          </div>
          <PmmInstanceList pmmInstances={inventory || []} loading={loading} />
        </div>
      </div>
    </PrivateLayout>
  );
};
