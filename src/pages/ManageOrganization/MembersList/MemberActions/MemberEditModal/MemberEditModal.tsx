import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { Modal, LoaderButton, TextInputField } from '@percona/platform-core';
import { Button, useStyles, Select, Label } from '@grafana/ui';
import { withTypes, FormRenderProps, Field } from 'react-final-form';
import { getIsOrgPending } from 'store/orgs';
import { getStyles } from './MemberEditModal.styles';
import { ROLES } from '../../../ManageOrganization.constants';
import { EditMemberFormFields } from '../../../ManageOrganization.types';
import { Messages } from './MemberEditModal.messages';
import { MemberEditModalProps } from './MemberEditModal.types';

const { Form } = withTypes<EditMemberFormFields>();

export const MemberEditModal: FC<MemberEditModalProps> = ({ member, isVisible, onClose, onSubmit }) => {
  const styles = useStyles(getStyles);
  const pending = useSelector(getIsOrgPending);
  const { role, firstName, lastName, email } = member;
  const initialValues = { role: { label: role, value: role }, email, name: `${firstName} ${lastName}` };

  /**
   * Had to remove the defaultValues from `name` and `email` fields.
   * Using the fields' defaultValue is a no-go in a controlled form, since it's setting pristine to `false`.
   * Must use the form's top-level initialValues
   * name: defaultValue={`${firstName} ${lastName}`}
   * email: defaultValue={email}
   */
  return (
    <Modal title={Messages.editMember} isVisible={isVisible} onClose={onClose}>
      {/* TODO: fix this cast to any => fixed and now working */}
      <Form onSubmit={onSubmit} initialValues={initialValues}>
        {({ handleSubmit, valid, pristine, values }: FormRenderProps) => (
          <form onSubmit={handleSubmit} className={styles.editForm} data-testid="edit-member-form">
            <TextInputField name="name" label={Messages.name} fieldClassName={styles.inputLabel} disabled />
            <TextInputField name="email" label={Messages.email} fieldClassName={styles.inputLabel} disabled />
            <Field name="role">
              {({ input }) => (
                <>
                  <Label className={styles.selectLabel}>{Messages.role}</Label>
                  <Select className={styles.roleSelect} options={ROLES} {...input} />
                </>
              )}
            </Field>
            <div className={styles.buttonGroup}>
              <Button
                className={styles.actionButton}
                data-testid="edit-member-cancel-button"
                type="button"
                variant="secondary"
                onClick={onClose}
              >
                {Messages.cancel}
              </Button>
              <LoaderButton
                data-testid="edit-member-submit-button"
                className={styles.actionButton}
                type="submit"
                loading={pending}
                disabled={!valid || pending || pristine}
              >
                {Messages.save}
              </LoaderButton>
            </div>
          </form>
        )}
      </Form>
    </Modal>
  );
};
