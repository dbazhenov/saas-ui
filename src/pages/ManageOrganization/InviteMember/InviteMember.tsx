import React, { FC, useState } from 'react';
import { Form, FormRenderProps, Field } from 'react-final-form';
import { useStyles, Button, Label, Select } from '@grafana/ui';
import { LoaderButton, Modal, TextInputField, validators } from '@percona/platform-core';
import { getStyles } from './InviteMember.styles';
import { Messages } from './InviteMember.messages';
import { ROLES } from './InviteMember.constants';
import { InviteMemberFormFields, MemberRole } from '../ManageOrganization.types';
import { InviteMemberProps } from './InviteMember.types';

const { email: emailValidator, required } = validators;

const initialValues = {
  email: '',
  role: ROLES.find((role) => role.value === MemberRole.technical),
};

export const InviteMember: FC<InviteMemberProps> = ({ onInviteMemberSubmit, loading }) => {
  const styles = useStyles(getStyles);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleModalClose = () => {
    setIsModalVisible((currentValue) => !currentValue);
  };

  const handleInviteMemberClick = () => {
    setIsModalVisible(true);
  };

  const handleInviteMemberSubmit = (formData: InviteMemberFormFields) => {
    setIsModalVisible(false);
    onInviteMemberSubmit(formData);
  };

  return (
    <div data-testid="invite-member-wrapper" className={styles.container}>
      <Button
        data-testid="invite-member-button"
        icon="plus"
        className={styles.inviteButton}
        onClick={handleInviteMemberClick}
      >
          {Messages.inviteMember}
      </Button>
      <Modal
        title={Messages.inviteMember}
        isVisible={isModalVisible}
        onClose={handleModalClose}
      >
        <Form onSubmit={handleInviteMemberSubmit} initialValues={initialValues}>
          {({ handleSubmit, valid, pristine }: FormRenderProps) => (
            <form onSubmit={handleSubmit} className={styles.inviteForm} data-testid="invite-member-form">
              <TextInputField name="email" label={Messages.email} validators={[emailValidator, required]} />
              <Field name="role">
                {({ input }) => (
                  <>
                    <Label className={styles.roleSelectLabel}>{Messages.role}</Label>
                    <Select className={styles.roleSelect} options={ROLES} {...input} />
                  </>
                )}
              </Field>
              <LoaderButton
                data-testid="invite-member-submit-button"
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
    </div>
  );
};
