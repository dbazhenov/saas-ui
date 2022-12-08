import React, { FC, useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { cx } from 'emotion';
import { IconButton, CircularProgress } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { useStyles } from 'core/utils';
import { ReactComponent as OrganizationLogo } from 'assets/organization.svg';
import {
  enterOrganizationEditing,
  getCurrentOrgCreationDate,
  getCurrentOrgName,
  getFirstOrgId,
  getIsOrgPending,
  getIsUserAdmin,
  getOrganizationAction,
  setOrgDetailsSeen,
  deleteOrganizationAction,
} from 'store/orgs';
import { getUserCompanyName } from 'store/auth';
import { getStyles } from './OrganizationView.styles';
import { Messages } from './OrganizationView.messages';
import { OrganizationDeleteModal } from './OrganizationDeleteModal';

export const OrganizationView: FC = () => {
  const styles = useStyles(getStyles);
  const dispatch = useDispatch();
  const orgId = useSelector(getFirstOrgId);
  const orgName = useSelector(getCurrentOrgName);
  const companyName = useSelector(getUserCompanyName);
  const orgCreationDate = useSelector(getCurrentOrgCreationDate);
  const pending = useSelector(getIsOrgPending);
  const [displayName, setDisplayName] = useState<string>(companyName || orgName);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const isUserAdmin = useSelector(getIsUserAdmin);

  const containerStyles = cx({
    [styles.container]: true,
    [styles.containerLoading]: pending,
  });

  const handleDeleteModalClose = () => {
    setIsDeleteModalVisible(false);
  };

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

  const handleDeleteOrganizationSubmit = useCallback(() => {
    setIsDeleteModalVisible(false);
    dispatch(deleteOrganizationAction(orgId));
  }, [dispatch, orgId]);

  const handleDeleteOrganizationClick = () => {
    setIsDeleteModalVisible(true);
  };

  return (
    <>
      <div data-testid="create-organization-wrapper" className={containerStyles}>
        {pending ? (
          <CircularProgress />
        ) : (
          <>
            <OrganizationLogo />
            <div className={styles.orgDetails}>
              {displayName && (
                <>
                  <span>
                    {Messages.organizationName}:{' '}
                    <strong data-testid="organization-name">{displayName}</strong>
                  </span>
                  {orgCreationDate && (
                    <span>
                      {Messages.creationDate}: <strong>{orgCreationDate}</strong>
                    </span>
                  )}
                  <div className={styles.actions}>
                    {/* NOTE: if companyName exists it means that the company comes from ServiceNow */}
                    {!companyName && (
                      <IconButton
                        data-testid="member-actions-edit"
                        title={Messages.editOrganization}
                        onClick={handleEditOrganizationClick}
                        disabled={!isUserAdmin}
                      >
                        <Edit />
                      </IconButton>
                    )}
                    <IconButton
                      data-testid="member-actions-delete"
                      title={Messages.deleteOrganization}
                      onClick={handleDeleteOrganizationClick}
                      disabled={!isUserAdmin}
                    >
                      <Delete />
                    </IconButton>
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </div>
      <OrganizationDeleteModal
        orgId={orgId}
        orgName={displayName}
        isVisible={isDeleteModalVisible}
        onSubmit={handleDeleteOrganizationSubmit}
        onClose={handleDeleteModalClose}
      />
    </>
  );
};
