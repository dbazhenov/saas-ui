/* eslint-disable react/jsx-curly-newline */
import React, { FC, useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Form, FormRenderProps, Field } from 'react-final-form';
import { useStyles, Button, Label, Select, IconButton } from '@grafana/ui';
import { LoaderButton, Modal, validators, TextInputField } from '@percona/platform-core';
import {
  bulkInviteOrgMembersAction,
  clearBulkInvite,
  getBulkInviteUsers,
  getFirstOrgId,
  getIsOrgPending,
} from 'store/orgs';
import { FieldArray } from 'react-final-form-arrays';
import arrayMutators from 'final-form-arrays';
import { FormApi } from 'final-form';
import { toast } from 'react-toastify';
import { getStyles } from './InviteMember.styles';
import { Messages } from './InviteMember.messages';
import { ROLES } from '../ManageOrganization.constants';
import { BulkInviteForm, MemberRole } from '../ManageOrganization.types';

const { email: emailValidator, required } = validators;

export const InviteMember: FC = () => {
  const styles = useStyles(getStyles);
  const pending = useSelector(getIsOrgPending);
  const orgId = useSelector(getFirstOrgId);
  const bulkInvitedUsers = useSelector(getBulkInviteUsers);
  const dispatch = useDispatch();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [displayErrorOnRender, setDisplayErrorOnRender] = useState(false);

  useEffect(() => {
    if (bulkInvitedUsers.invitedUsers.find((user) => user.error.length > 0)) {
      setDisplayErrorOnRender(true);
      setIsModalVisible(true);
    } else {
      setDisplayErrorOnRender(false);
      setIsModalVisible(false);
    }
  }, [bulkInvitedUsers]);

  const validateResponse = (value: string) => {
    const foundUser = bulkInvitedUsers.invitedUsers.find((user) => user.username === value);

    if (foundUser) {
      return foundUser.error;
    }

    return undefined;
  };

  const handleModalClose = () => {
    setIsModalVisible((currentValue) => !currentValue);
    dispatch(clearBulkInvite());
  };

  const handleInviteMemberClick = () => {
    setIsModalVisible(true);
  };

  const handleAddNewRow = (form: FormApi<any>) => {
    const maximalAmountOfUsers = 10;

    if (form.getState().values.invitedUsers.length < maximalAmountOfUsers) {
      form.pauseValidation();
      form.mutators.push('invitedUsers', {
        role: ROLES.find((role) => role.value === MemberRole.technical),
      });
      form.resumeValidation();
    } else {
      toast.warning(Messages.userLimit);
    }
  };

  const handleInviteMemberSubmit = useCallback(
    ({ invitedUsers }: BulkInviteForm) => {
      dispatch(
        bulkInviteOrgMembersAction({
          orgId,
          users: invitedUsers.map((user) => ({ username: user.username, role: user.role.value! })),
        }),
      );
    },
    [dispatch, orgId],
  );

  return (
    <div data-testid="invite-member-wrapper" className={styles.container}>
      <Button
        data-testid="invite-member-button"
        icon="plus"
        className={styles.inviteButton}
        onClick={handleInviteMemberClick}
      >
        {Messages.inviteMembers}
      </Button>
      <Modal title={Messages.inviteMembers} isVisible={isModalVisible} onClose={handleModalClose}>
        <Form
          onSubmit={handleInviteMemberSubmit}
          initialValues={bulkInvitedUsers}
          mutators={{ ...arrayMutators }}
        >
          {({ handleSubmit, valid, pristine, form }: FormRenderProps) => (
            <form onSubmit={handleSubmit} className={styles.inviteForm} data-testid="invite-member-form">
              <section className={styles.rowContainer}>
                <div className={styles.rowEmailHeader}>
                  <Label>{Messages.email}</Label>
                </div>
                <div className={styles.rowRoleHeader}>
                  <Label>{Messages.role}</Label>
                </div>
                <FieldArray name="invitedUsers">
                  {({ fields }) =>
                    fields.map((name, index) => (
                      <>
                        <div className={styles.rowEmail} data-testid={`email-input-container-${index}`}>
                          <TextInputField
                            fieldClassName={styles.emailField}
                            name={`${name}.username`}
                            showErrorOnRender={displayErrorOnRender}
                            validators={[required, emailValidator, validateResponse]}
                          />
                        </div>
                        <div className={styles.rowRole} data-testid={`role-input-container-${index}`}>
                          <Field name={`${name}.role`}>
                            {({ input }) => (
                              <Select className={styles.roleSelect} options={ROLES} {...input} />
                            )}
                          </Field>
                          <span className={styles.iconButtonContainer}>
                            <IconButton
                              type="button"
                              className={styles.iconButton}
                              data-testid="invite-member-remove-row"
                              disabled={fields.length! <= 1}
                              // @ts-ignore
                              name="fa fa-times"
                              size="xxl"
                              onClick={() => form.mutators.remove('invitedUsers', index)}
                              title={Messages.remove}
                            />
                          </span>
                        </div>
                      </>
                    ))
                  }
                </FieldArray>
              </section>
              <Button
                data-testid="invite-member-add-user"
                variant="link"
                type="button"
                className={styles.addRowLink}
                onClick={() => handleAddNewRow(form)}
              >
                {Messages.addAnotherUser}
              </Button>
              <div className={styles.footerContainer}>
                <span className={styles.footerMessage}>{Messages.userLimit}</span>
                <span>
                  <LoaderButton
                    data-testid="invite-member-submit-button"
                    className={styles.saveButton}
                    type="submit"
                    loading={pending}
                    disabled={!valid || pending || pristine}
                  >
                    {Messages.invite}
                  </LoaderButton>
                </span>
              </div>
            </form>
          )}
        </Form>
      </Modal>
    </div>
  );
};
