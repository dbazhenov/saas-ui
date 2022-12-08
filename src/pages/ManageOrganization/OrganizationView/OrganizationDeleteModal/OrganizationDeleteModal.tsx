import React, { FC, useState } from 'react';
import { useSelector } from 'react-redux';
import { LoadingButton } from '@mui/lab';
import { Alert, Button } from '@mui/material';
import { TextField } from 'mui-rff';
import { Form, FormRenderProps } from 'react-final-form';
import { useStyles } from 'core/utils';
import { getIsOrgPending } from 'store/orgs';
import { SimpleDialog } from 'components';
import { getStyles } from './OrganizationDeleteModal.styles';
import { Messages } from './OrganizationDeleteModal.messages';
import { OrganizationDeleteModalProps } from './OrganizationDeleteModal.types';

export const OrganizationDeleteModal: FC<OrganizationDeleteModalProps> = ({
  orgId,
  orgName,
  isVisible,
  onClose,
  onSubmit,
}) => {
  const styles = useStyles(getStyles);
  const pending = useSelector(getIsOrgPending);
  const [typedOrgName, setTypedOrgName] = useState('');

  return (
    <SimpleDialog
      title={Messages.modalTitle}
      open={isVisible}
      onClose={onClose}
      actions={
        <>
          <Button onClick={onClose} data-testid="delete-organization-cancel-button">
            {Messages.cancel}
          </Button>
          <LoadingButton
            data-testid="delete-organization-submit-button"
            loading={pending}
            disabled={typedOrgName !== orgName}
            color="warning"
            onClick={onSubmit}
          >
            {Messages.buttonTitle}
          </LoadingButton>
        </>
      }
    >
      <Alert severity="warning">{Messages.warningLabel}</Alert>
      <div>
        <p data-testid="delete-org-message">{Messages.deleteOrganization(orgName)}</p>
        <p data-testid="delete-org-confirm">{Messages.confirmDeletionTitle}</p>
        <Form onSubmit={() => {}}>
          {({ handleSubmit, values }: FormRenderProps) => {
            setTypedOrgName(values.orgName);

            return (
              <form onSubmit={handleSubmit} data-testid="delete-organization-form">
                <div>
                  <TextField
                    name="orgName"
                    inputProps={{ 'data-testid': 'orgName-text-input' }}
                    className={styles.textField}
                  />
                </div>
              </form>
            );
          }}
        </Form>
      </div>
    </SimpleDialog>
  );
};
