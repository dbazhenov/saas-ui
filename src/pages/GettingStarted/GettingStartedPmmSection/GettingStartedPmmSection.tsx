import React, { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Routes } from 'core/routes';
import { getOrgInventory, getFirstOrgId, getOrgState } from 'store/orgs/orgs.selectors';
import { getInventoryAction } from 'store/orgs';
import { Messages } from './GettingStartedPmmSection.messages';
import { GettingStartedSection } from '../GettingStartedSection';
import { READ_MORE_LINK } from './GettingStartedPmmSection.constants';

export const GettingStartedPmmSection: FC = () => {
  const dispatch = useDispatch();
  const inventory = useSelector(getOrgInventory);
  const orgId = useSelector(getFirstOrgId);
  const { pending } = useSelector(getOrgState);

  useEffect(() => {
    if (!inventory.length && orgId) {
      dispatch(getInventoryAction(orgId));
    }
  }, [dispatch, inventory.length, orgId]);

  return (
    <GettingStartedSection
      description={Messages.connectPMMDescription}
      title={Messages.connectPMMTitle}
      linkTo={Routes.instances}
      linkText={Messages.viewInstances}
      isTicked={!!inventory?.length}
      loading={pending}
      disabled={!inventory?.length}
      readMoreLink={READ_MORE_LINK}
    />
  );
};
