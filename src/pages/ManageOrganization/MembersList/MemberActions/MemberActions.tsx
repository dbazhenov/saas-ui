import React, { FC, useContext, useState } from 'react';
import { Modal, LoaderButton, TextInputField } from '@percona/platform-core';
import { useStyles, IconButton, Select, Label } from '@grafana/ui';
import { withTypes, FormRenderProps, Field } from 'react-final-form';
import { getStyles } from './MemberActions.styles';
import { ROLES } from '../../ManageOrganization.constants';
import { MemberActionsProps } from './MemberActions.types';
import { EditMemberFormFields, MemberRole } from '../../ManageOrganization.types';
import { Messages } from './MembersActions.messages';
import { ManageOrganizationProvider } from '../../ManageOrganization.provider';

const { Form } = withTypes<EditMemberFormFields>();

export const MemberActions: FC<MemberActionsProps> = ({ member }) => {
  const {
    onEditMemberSubmit,
    loading,
    userInfo,
    userRole,
  } = useContext(ManageOrganizationProvider);
  const { role, firstName, lastName, email, memberId } = member;
  const styles = useStyles(getStyles);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleEditModalClose = () => {
    setIsModalVisible((currentValue) => !currentValue);
  };

  const handleEditMemberClick = () => {
    setIsModalVisible(true);
  };

  const handleEditMemberSubmit = (formData: EditMemberFormFields) => {
    setIsModalVisible(false);
    onEditMemberSubmit({ role: formData.role, memberId });
  };

  return (
    <>
      <div className={styles.actionsWrapper} data-testid="member-actions">
        <IconButton
          data-testid="member-actions-edit"
          name="pen"
          title={Messages.edit}
          onClick={handleEditMemberClick}
          disabled={userInfo.email === member.email || userRole !== MemberRole.admin}
        />
      </div>
      <Modal
        title={Messages.editMember}
        isVisible={isModalVisible}
        onClose={handleEditModalClose}
      >
        {/* TODO: fix this cast to any */}
        <Form onSubmit={handleEditMemberSubmit} initialValues={{ role: role as any }}>
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
    </>
  );
};
