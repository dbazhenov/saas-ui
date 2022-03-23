import React, { FC, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Form, FormRenderProps } from 'react-final-form';
import { useStyles } from '@grafana/ui';
import { LoaderButton, TextInputField, validators } from '@percona/platform-core';
import { createOrganizationAction } from 'store/orgs';
import { ReactComponent as OrganizationLogo } from 'assets/organization.svg';
import { getStyles } from './OrganizationCreate.styles';
import { Messages } from './OrganizationCreate.messages';
import { OrganizationCreateProps } from './OrganizationCreate.types';
import { CreateOrganizationPayload } from '../ManageOrganization.types';

export const OrganizationCreate: FC<OrganizationCreateProps> = ({ loading }) => {
  const styles = useStyles(getStyles);
  const dispatch = useDispatch();

  const onCreateOrgSubmit = useCallback(({ organizationName }: CreateOrganizationPayload) => {
    dispatch(createOrganizationAction(organizationName));
  }, [dispatch]);

  return (
    <div data-testid="create-organization-wrapper" className={styles.container}>
      <OrganizationLogo />
      <h4 className={styles.title}>{Messages.createOrganization}</h4>
      <Form onSubmit={onCreateOrgSubmit}>
        {({ handleSubmit, pristine, valid }: FormRenderProps) => (
          <form data-testid="create-organization-form" className={styles.form} onSubmit={handleSubmit}>
            <TextInputField
              className={styles.orgNameInput}
              label={Messages.organizationName}
              placeholder={Messages.orgNamePlaceholder}
              name="organizationName"
              validators={[validators.required]} />
            <LoaderButton
              data-testid="create-organization-submit-button"
              type="submit"
              loading={loading}
              disabled={!valid || loading || pristine}
            >
              {Messages.save}
            </LoaderButton>
          </form>
        )}
      </Form>
    </div>
  );
};
