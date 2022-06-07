import React, { FC, useCallback } from 'react';
import { Form, FormRenderProps } from 'react-final-form';
import { useDispatch, useSelector } from 'react-redux';
import { useStyles } from '@grafana/ui';
import { LoaderButton, TextInputField, validators } from '@percona/platform-core';
import { ReactComponent as OrganizationLogo } from 'assets/organization.svg';
import {
  getCurrentOrgId,
  getCurrentOrgName,
  editOrganizationAction,
  exitOrganizationEditing,
} from 'store/orgs';
import { getStyles } from './OrganizationEdit.styles';
import { Messages } from './OrganizationEdit.messages';
import { OrganizationEditProps, EditOrganizationPayload } from './OrganizationEdit.types';

export const OrganizationEdit: FC<OrganizationEditProps> = ({ loading }) => {
  const styles = useStyles(getStyles);
  const dispatch = useDispatch();
  const orgName = useSelector(getCurrentOrgName);
  const orgId = useSelector(getCurrentOrgId);

  const handleEditOrgSubmit = useCallback(
    ({ organizationName }: EditOrganizationPayload) => {
      dispatch(editOrganizationAction({ orgId, name: organizationName }));
    },
    [dispatch, orgId],
  );

  const handleEditOrgCancel = useCallback(() => {
    dispatch(exitOrganizationEditing());
  }, [dispatch]);

  return (
    <div data-testid="edit-organization-wrapper" className={styles.container}>
      <OrganizationLogo />
      <h4 className={styles.title}>{Messages.editOrganization}</h4>
      <Form onSubmit={handleEditOrgSubmit}>
        {({ handleSubmit, pristine, valid }: FormRenderProps) => (
          <form data-testid="edit-organization-form" className={styles.form} onSubmit={handleSubmit}>
            <TextInputField
              className={styles.orgNameInput}
              label={Messages.organizationName}
              placeholder={Messages.orgNamePlaceholder}
              name="organizationName"
              initialValue={orgName}
              validators={[validators.required]}
            />
            <div className={styles.actions}>
              <LoaderButton
                data-testid="edit-organization-cancel-button"
                variant="secondary"
                type="button"
                onClick={handleEditOrgCancel}
              >
                {Messages.cancel}
              </LoaderButton>
              <LoaderButton
                data-testid="edit-organization-submit-button"
                type="submit"
                loading={loading}
                disabled={!valid || loading || pristine}
              >
                {Messages.save}
              </LoaderButton>
            </div>
          </form>
        )}
      </Form>
    </div>
  );
};
