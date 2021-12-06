import React, { FC } from 'react';
import { Modal, LoaderButton, CheckboxField } from '@percona/platform-core';
import { useStyles } from '@grafana/ui';
import { Form, FormRenderProps } from 'react-final-form';
import { getStyles } from './MemberDeleteModal.styles';
import { Messages } from './MemberDeleteModal.messages';
import { MemberDeleteModalProps } from './MemberDeleteModal.types';

export const MemberDeleteModal: FC<MemberDeleteModalProps> = ({
  isVisible,
  loading,
  onClose,
  onSubmit,
}) => {
  const styles = useStyles(getStyles);

  return (
    <Modal
      title={Messages.deleteMember}
      isVisible={isVisible}
      onClose={onClose}
    >
      <Form onSubmit={onSubmit}>
        {({ handleSubmit, values }: FormRenderProps) => (
          <form onSubmit={handleSubmit} className={styles.deleteForm} data-testid="delete-member-form">
            <CheckboxField
              name="confirm"
              label={Messages.confirm}
              disabled={loading}
            />
            <LoaderButton
              data-testid="delete-member-submit-button"
              className={styles.saveButton}
              type="submit"
              loading={loading}
              variant="destructive"
              disabled={!values.confirm || loading}
            >
              {Messages.delete}
            </LoaderButton>
          </form>
        )}
      </Form>
    </Modal>
  );
};
