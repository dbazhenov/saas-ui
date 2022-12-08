import React, { FC, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Form, FormRenderProps } from 'react-final-form';
import { useStyles } from 'core/utils';
import { TextField } from 'mui-rff';
import { LoadingButton } from '@mui/lab';
import { Typography } from '@mui/material';
import { createOrganizationAction } from 'store/orgs';
import { ReactComponent as OrganizationLogo } from 'assets/organization.svg';
import { getStyles } from './OrganizationCreate.styles';
import { Messages } from './OrganizationCreate.messages';
import { OrganizationCreateProps } from './OrganizationCreate.types';
import { CreateOrganizationPayload } from '../ManageOrganization.types';

export const OrganizationCreate: FC<OrganizationCreateProps> = ({ loading }) => {
  const styles = useStyles(getStyles);
  const dispatch = useDispatch();

  const onCreateOrgSubmit = useCallback(
    ({ organizationName }: CreateOrganizationPayload) => {
      dispatch(createOrganizationAction(organizationName));
    },
    [dispatch],
  );

  return (
    <div data-testid="create-organization-wrapper" className={styles.container}>
      <OrganizationLogo />
      <Typography variant="h5" className={styles.title}>
        {Messages.createOrganization}
      </Typography>
      <Form onSubmit={onCreateOrgSubmit}>
        {({ handleSubmit, pristine, valid }: FormRenderProps) => (
          <form data-testid="create-organization-form" className={styles.form} onSubmit={handleSubmit}>
            <TextField
              className={styles.orgNameInput}
              label={Messages.organizationName}
              placeholder={Messages.orgNamePlaceholder}
              name="organizationName"
              required
              inputProps={{ 'data-testid': 'organizationName-text-input' }}
            />
            <LoadingButton
              data-testid="create-organization-submit-button"
              className={styles.saveButton}
              type="submit"
              loading={loading}
              disabled={!valid || loading || pristine}
            >
              {Messages.save}
            </LoadingButton>
          </form>
        )}
      </Form>
    </div>
  );
};
