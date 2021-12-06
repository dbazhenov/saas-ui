import React, { FC } from 'react';
import { Modal, LoaderButton, TextInputField } from '@percona/platform-core';
import { useStyles, Select, Label } from '@grafana/ui';
import { withTypes, FormRenderProps, Field } from 'react-final-form';
import { getStyles } from './MemberEditModal.styles';
import { ROLES } from '../../../ManageOrganization.constants';
import { EditMemberFormFields } from '../../../ManageOrganization.types';
import { Messages } from './MemberEditModal.messages';
import { MemberEditModalProps } from './MemberEditModal.types';

const { Form } = withTypes<EditMemberFormFields>();

export const MemberEditModal: FC<MemberEditModalProps> = ({
  member,
  isVisible,
  loading,
  onClose,
  onSubmit,
}) => {
  const styles = useStyles(getStyles);
  const { role, firstName, lastName, email } = member;

  return (
    <Modal
      title={Messages.editMember}
      isVisible={isVisible}
      onClose={onClose}
    >
      {/* TODO: fix this cast to any */}
      <Form onSubmit={onSubmit} initialValues={{ role: role as any }}>
        {({ handleSubmit, valid, pristine }: FormRenderProps) => (
          <form onSubmit={handleSubmit} className={styles.editForm} data-testid="edit-member-form">
            <TextInputField
              name="name"
              label={Messages.name}
              fieldClassName={styles.inputLabel}
              defaultValue={`${firstName} ${lastName}`}
              disabled
            />
            <TextInputField
              name="email"
              label={Messages.email}
              defaultValue={email}
              fieldClassName={styles.inputLabel}
              disabled
            />
            <Field name="role">
              {({ input }) => (
                <>
                  <Label className={styles.selectLabel}>{Messages.role}</Label>
                  <Select className={styles.roleSelect} options={ROLES} {...input} />
                </>
              )}
            </Field>
            <LoaderButton
              data-testid="edit-member-submit-button"
              className={styles.saveButton}
              type="submit"
              loading={loading}
              disabled={!valid || loading || pristine}
            >
              {Messages.save}
            </LoaderButton>
          </form>
        )}
      </Form>
    </Modal>
  );
};
