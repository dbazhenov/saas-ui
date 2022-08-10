import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { Modal, LoaderButton } from '@percona/platform-core';
import { useStyles, Button, HorizontalGroup } from '@grafana/ui';
import { Form, FormRenderProps } from 'react-final-form';
import { getIsOrgPending } from 'store/orgs';
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

  return (
    <Modal title={Messages.deleteOrganizationTitle} isVisible={isVisible} onClose={onClose}>
      <p className={styles.deleteMessage}>{Messages.deleteOrganization(orgName)}</p>
      <Form onSubmit={onSubmit}>
        {({ handleSubmit }: FormRenderProps) => (
          <form onSubmit={handleSubmit} className={styles.deleteForm} data-testid="delete-organization-form">
            <HorizontalGroup justify="space-between" spacing="md">
              <Button
                variant="secondary"
                size="md"
                onClick={onClose}
                data-testid="delete-organization-cancel-button"
              >
                {Messages.cancel}
              </Button>
              <LoaderButton
                data-testid="delete-organization-submit-button"
                className={styles.saveButton}
                type="submit"
                loading={pending}
                variant="destructive"
                disabled={pending}
              >
                {Messages.confirm}
              </LoaderButton>
            </HorizontalGroup>
          </form>
        )}
      </Form>
    </Modal>
  );
};
