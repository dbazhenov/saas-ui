import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { Modal, LoaderButton } from '@percona/platform-core';
import { useStyles, Button, HorizontalGroup } from '@grafana/ui';
import { Form, FormRenderProps } from 'react-final-form';
import { getIsOrgPending } from 'store/orgs';
import { getStyles } from './PmmInstanceRemoveModal.styles';
import { Messages } from './PmmInstanceRemoveModal.messages';
import { PmmInstallRemoveModalProps } from './PmmInstanceRemoveModal.types';

export const PmmInstanceRemoveModal: FC<PmmInstallRemoveModalProps> = ({
  instance,
  isVisible,
  onClose,
  onSubmit,
}) => {
  const styles = useStyles(getStyles);
  const pending = useSelector(getIsOrgPending);

  return (
    <Modal title={Messages.deleteMemberTitle} isVisible={isVisible} onClose={onClose}>
      <p className={styles.deleteMessage}>{Messages.removeInstance(instance.name)}</p>
      <Form onSubmit={onSubmit}>
        {({ handleSubmit }: FormRenderProps) => (
          <form onSubmit={handleSubmit} className={styles.deleteForm} data-testid="delete-member-form">
            <HorizontalGroup justify="space-between" spacing="md">
              <Button
                variant="secondary"
                size="md"
                onClick={onClose}
                data-testid="delete-member-cancel-button"
              >
                {Messages.cancel}
              </Button>
              <LoaderButton
                data-testid="delete-member-submit-button"
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
