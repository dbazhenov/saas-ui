import React, { FC, useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { cx } from 'emotion';
import { IconButton, Spinner, useStyles } from '@grafana/ui';
import { ReactComponent as OrganizationLogo } from 'assets/organization.svg';
import {
  enterOrganizationEditing,
  getCurrentOrgCreationDate,
  getCurrentOrgName,
  getFirstOrgId,
  getIsOrgPending,
  getOrganizationAction,
  setOrgDetailsSeen,
} from 'store/orgs';
import { getUserCompanyName } from 'store/auth';
import { getStyles } from './OrganizationView.styles';
import { Messages } from './OrganizationView.messages';

export const OrganizationView: FC = () => {
  const styles = useStyles(getStyles);
  const dispatch = useDispatch();
  const orgId = useSelector(getFirstOrgId);
  const orgName = useSelector(getCurrentOrgName);
  const companyName = useSelector(getUserCompanyName);
  const orgCreationDate = useSelector(getCurrentOrgCreationDate);
  const pending = useSelector(getIsOrgPending);
  const [displayName, setDisplayName] = useState<string>();

  const containerStyles = cx({
    [styles.container]: true,
    [styles.containerLoading]: pending,
  });

  useEffect(() => {
    if (orgId && !pending && !orgName) {
      dispatch(getOrganizationAction(orgId));
    }
  }, [dispatch, orgId, orgName, pending]);

  useEffect(() => {
    if (displayName) {
      dispatch(setOrgDetailsSeen());
    }
  }, [dispatch, displayName]);

  useEffect(() => {
    setDisplayName(companyName || orgName);
  }, [orgName, companyName]);

  const handleEditOrganizationClick = useCallback(() => {
    dispatch(enterOrganizationEditing());
  }, [dispatch]);

  return (
    <div data-testid="create-organization-wrapper" className={containerStyles}>
      {pending ? (
        <Spinner />
      ) : (
        <>
          <OrganizationLogo />
          <div className={styles.orgDetails}>
            {displayName && (
              <>
                <span>
                  {Messages.organizationName}: <strong>{displayName}</strong>
                </span>
                {orgCreationDate && (
                  <span>
                    {Messages.creationDate}: <strong>{orgCreationDate}</strong>
                  </span>
                )}
                {!companyName && (
                  <div className={styles.actions}>
                    <IconButton
                      data-testid="member-actions-edit"
                      name="pen"
                      title={Messages.editOrganization}
                      onClick={handleEditOrganizationClick}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};
