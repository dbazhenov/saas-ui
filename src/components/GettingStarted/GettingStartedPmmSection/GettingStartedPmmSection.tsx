import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { Routes } from 'core/routes';
import { getOrgInventory, getOrgState } from 'store/orgs/orgs.selectors';
import { Messages } from './GettingStartedPmmSection.messages';
import { GettingStartedSection } from '../GettingStartedSection';
import { READ_MORE_LINK } from './GettingStartedPmmSection.constants';

export const GettingStartedPmmSection: FC = () => {
  const inventory = useSelector(getOrgInventory);
  const { pending } = useSelector(getOrgState);

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
