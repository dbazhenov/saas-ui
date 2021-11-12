import React, { FC } from 'react';
import { Form, FormRenderProps } from 'react-final-form';
import { useStyles } from '@grafana/ui';
import { LoaderButton, TextInputField, validators } from '@percona/platform-core';
import { ReactComponent as OrganizationLogo } from 'assets/organization.svg';
import { getStyles } from './OrganizationCreate.styles';
import { Messages } from './OrganizationCreate.messages';
import { OrganizationCreateProps } from './OrganizationCreate.types';

export const OrganizationCreate: FC<OrganizationCreateProps> = ({ onCreateOrgSubmit, loading }) => {
  const styles = useStyles(getStyles);

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
