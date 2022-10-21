import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { Modal, LoaderButton, TextInputField } from '@percona/platform-core';
import { useStyles, Button, HorizontalGroup, Alert } from '@grafana/ui';
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
    <Modal
      title={Messages.modalTitle}
      isVisible={isVisible}
      onClose={onClose}
      fieldClassName={styles.deleteMessageWarning}
      contentClassName={styles.extraPaddingForModal}
    >
      <Alert title={Messages.warningLabel} className={styles.alertBackground} />
      <div className={styles.formMargin}>
        <p className={styles.deleteMessage} data-testid="delete-org-message">
          {Messages.deleteOrganization(orgName)}
        </p>
        <p className={styles.confirmMessage} data-testid="delete-org-confirm">
          {Messages.confirmDeletionTitle}
        </p>
        <Form onSubmit={onSubmit}>
          {({ handleSubmit, values }: FormRenderProps) => (
            <form
              onSubmit={handleSubmit}
              className={styles.deleteForm}
              data-testid="delete-organization-form"
            >
              <div className={styles.inputMargin}>
                <TextInputField name="orgName" fieldClassName={styles.inputOrg} />
              </div>
              <HorizontalGroup justify="flex-end" spacing="md">
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
                  variant={values.orgName === orgName ? 'primary' : 'secondary'}
                  disabled={values.orgName !== orgName}
                  buttonClassName={
                    values.orgName === orgName ? styles.activeColorButton : styles.disabledColorButton
                  }
                >
                  {Messages.buttonTitle}
                </LoaderButton>
              </HorizontalGroup>
            </form>
          )}
        </Form>
      </div>
    </Modal>
  );
};
