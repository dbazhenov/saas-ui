import React, { FC } from 'react';
import { Modal, LoaderButton } from '@percona/platform-core';
import { useStyles, Button, HorizontalGroup } from '@grafana/ui';
import { Form, FormRenderProps } from 'react-final-form';
import { getStyles } from './MemberDeleteModal.styles';
import { Messages } from './MemberDeleteModal.messages';
import { MemberDeleteModalProps } from './MemberDeleteModal.types';

export const MemberDeleteModal: FC<MemberDeleteModalProps> = ({
  member,
  isVisible,
  loading,
  onClose,
  onSubmit,
}) => {
  const styles = useStyles(getStyles);

  return (
    <Modal
      title={Messages.deleteMemberTitle}
      isVisible={isVisible}
      onClose={onClose}
    >
      <p className={styles.deleteMessage}>
       {Messages.deleteMember(member.email)}
      </p>
      <Form onSubmit={onSubmit}>
        {({ handleSubmit }: FormRenderProps) => (
          <form onSubmit={handleSubmit} className={styles.deleteForm} data-testid="delete-member-form">
            <HorizontalGroup justify="space-between" spacing="md">
              <Button
                variant="secondary"
                size="md"
                onClick={() => onClose()}
                data-testid="delete-member-cancel-button"
              >
                {Messages.cancel}
              </Button>
              <LoaderButton
                data-testid="delete-member-submit-button"
                className={styles.saveButton}
                type="submit"
                loading={loading}
                variant="destructive"
                disabled={loading}
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
