import React, { FC, useCallback } from 'react';
import { Form, FormRenderProps } from 'react-final-form';
import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup';
import { Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { TextField } from 'mui-rff';
import { validation } from 'core';
import { useStyles } from 'core/utils';
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

  const validationSchema = yup.object({
    organizationName: yup.string().label(Messages.organizationName).required(),
  });

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
      <Typography variant="h5" className={styles.title}>
        {Messages.editOrganization}
      </Typography>
      <Form
        onSubmit={handleEditOrgSubmit}
        validate={validation(validationSchema)}
        initialValues={{
          organizationName: orgName,
        }}
      >
        {({ handleSubmit, pristine, valid }: FormRenderProps) => (
          <form data-testid="edit-organization-form" className={styles.form} onSubmit={handleSubmit}>
            <TextField
              className={styles.orgNameInput}
              label={Messages.organizationName}
              placeholder={Messages.orgNamePlaceholder}
              name="organizationName"
              inputProps={{ 'data-testid': 'organizationName-text-input' }}
              FormHelperTextProps={{ id: 'organizationName-text-error' }}
              required
            />
            <div className={styles.actions}>
              <LoadingButton
                data-testid="edit-organization-cancel-button"
                type="button"
                onClick={handleEditOrgCancel}
              >
                {Messages.cancel}
              </LoadingButton>
              <LoadingButton
                data-testid="edit-organization-submit-button"
                type="submit"
                loading={loading}
                disabled={!valid || loading || pristine}
              >
                {Messages.save}
              </LoadingButton>
            </div>
          </form>
        )}
      </Form>
    </div>
  );
};
