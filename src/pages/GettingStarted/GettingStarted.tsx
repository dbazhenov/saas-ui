import React, { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useStyles } from '@grafana/ui';
import { searchOrgsAction, getFirstOrgId } from 'store/orgs';
import { getUserCompanyName, getUserCompanyAction } from 'store/auth';
import { PrivateLayout } from 'components/Layouts';
import { getStyles } from './GettingStarted.styles';
import { GettingStartedPmmSection } from './GettingStartedPmmSection';
import { GettingStartedOrgSection } from './GettingStartedOrgSection';

export const GettingStartedPage: FC = () => {
  const styles = useStyles(getStyles);
  const dispatch = useDispatch();
  const orgId = useSelector(getFirstOrgId);
  const companyName = useSelector(getUserCompanyName);

  useEffect(() => {
    if (!orgId) {
      dispatch(searchOrgsAction());
    }
  }, [dispatch, orgId]);

  useEffect(() => {
    if (!companyName) {
      dispatch(getUserCompanyAction());
    }
  }, [dispatch, companyName]);

  return (
    <PrivateLayout>
      <div data-testid="getting-started-container" className={styles.container}>
        <GettingStartedOrgSection />
        <GettingStartedPmmSection />
      </div>
    </PrivateLayout>
  );
};
