import React, { FC, useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Form, FormRenderProps } from 'react-final-form';
import { Button, IconButton, MenuItem, Dialog, DialogTitle, DialogContent } from '@mui/material';
import { Add, Close } from '@mui/icons-material';
import { useStyles } from 'core/utils';
import { LoadingButton } from '@mui/lab';
import * as yup from 'yup';
import { TextField } from 'mui-rff';
import {
  bulkInviteOrgMembersAction,
  clearBulkInvite,
  getBulkInviteUsers,
  getFirstOrgId,
  getIsOrgPending,
} from 'store/orgs';
import { validation } from 'core';
import { FieldArray } from 'react-final-form-arrays';
import arrayMutators from 'final-form-arrays';
import { FormApi } from 'final-form';
import { toast } from 'react-toastify';
import { getStyles } from './InviteMember.styles';
import { Messages } from './InviteMember.messages';
import { ROLES } from '../ManageOrganization.constants';
import { BulkInviteForm, BulkInviteFormFields, MemberRole } from '../ManageOrganization.types';

export const InviteMember: FC = () => {
  const styles = useStyles(getStyles);
  const pending = useSelector(getIsOrgPending);
  const orgId = useSelector(getFirstOrgId);
  const bulkInvitedUsers = useSelector(getBulkInviteUsers);
  const dispatch = useDispatch();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [usersWithError, setUsersWithError] = useState<BulkInviteFormFields>();

  const validationSchema = yup.object({
    invitedUsers: yup.array().of(
      yup.object({
        username: yup
          .string()
          .email()
          .label(Messages.email)
          .required()
          .test('invalidUser', Messages.userAlreadyInvited, (value) => {
            const isUserAlreadyPresent = !bulkInvitedUsers.invitedUsers.find(
              (user) => user.username === value,
            );

            return isUserAlreadyPresent;
          }),
      }),
    ),
  });

  useEffect(() => {
    setUsersWithError(bulkInvitedUsers.invitedUsers.find((user) => user.error.length > 0));
  }, [bulkInvitedUsers]);

  useEffect(() => {
    if (usersWithError) {
      setIsModalVisible(true);
    } else {
      setIsModalVisible(false);
    }
  }, [usersWithError]);

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
        role: ROLES.find((role) => role.value === MemberRole.technical)!.value,
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
          users: invitedUsers.map((user) => ({ username: user.username, role: user.role })),
        }),
      );
    },
    [dispatch, orgId],
  );

  return (
    <div data-testid="invite-member-wrapper" className={styles.container}>
      <Button
        data-testid="invite-member-button"
        className={styles.inviteButton}
        onClick={handleInviteMemberClick}
        variant="contained"
        startIcon={<Add />}
      >
        {Messages.inviteMembers}
      </Button>
      <Dialog fullWidth maxWidth="sm" open={isModalVisible} onClose={handleModalClose}>
        <DialogTitle>{Messages.inviteMembers}</DialogTitle>
        <DialogContent>
          <Form
            onSubmit={handleInviteMemberSubmit}
            validate={validation(validationSchema)}
            initialValues={bulkInvitedUsers}
            mutators={{ ...arrayMutators }}
          >
            {({ handleSubmit, valid, pristine, form }: FormRenderProps) => (
              <form onSubmit={handleSubmit} className={styles.inviteForm} data-testid="invite-member-form">
                <section className={styles.rowContainer}>
                  <FieldArray name="invitedUsers">
                    {({ fields }) =>
                      fields.map((name, index) => (
                        <div
                          className={styles.rowWrapper}
                          key={`${name}`}
                          data-testid={`user-row-index-${index}`}
                        >
                          <TextField
                            showError={({ meta: { error } }) =>
                              (pristine && !!usersWithError) || (!!error && !pristine)
                            }
                            className={styles.emailField}
                            fullWidth={false}
                            name={`${name}.username`}
                            label={Messages.email}
                            inputProps={{ 'data-testid': 'username-input' }}
                            FormHelperTextProps={{ id: 'username-error' }}
                          />
                          <TextField
                            fullWidth={false}
                            select
                            name={`${name}.role`}
                            label={Messages.role}
                            data-testid="role-select"
                          >
                            {ROLES.map((r) => (
                              <MenuItem key={r.value} value={r.value}>
                                {r.label}
                              </MenuItem>
                            ))}
                          </TextField>
                          <span className={styles.iconButtonContainer}>
                            <IconButton
                              className={styles.iconButton}
                              data-testid="invite-member-remove-row"
                              disabled={fields.length! <= 1}
                              onClick={() => form.mutators.remove('invitedUsers', index)}
                              title={Messages.remove}
                            >
                              <Close />
                            </IconButton>
                          </span>
                        </div>
                      ))
                    }
                  </FieldArray>
                </section>
                <Button
                  data-testid="invite-member-add-user"
                  type="button"
                  className={styles.addRowLink}
                  onClick={() => handleAddNewRow(form)}
                >
                  {Messages.addAnotherUser}
                </Button>
                <div className={styles.footerContainer}>
                  <span className={styles.footerMessage}>{Messages.userLimit}</span>
                  <div className={styles.buttonsWrapper}>
                    <div>
                      <Button
                        className={styles.saveButton}
                        onClick={handleModalClose}
                        data-testid="cancel-invite-user"
                      >
                        {Messages.cancel}
                      </Button>
                    </div>
                    <div>
                      <LoadingButton
                        data-testid="invite-member-submit-button"
                        className={styles.saveButton}
                        type="submit"
                        loading={pending}
                        disabled={!valid || pending || pristine}
                      >
                        {Messages.invite}
                      </LoadingButton>
                    </div>
                  </div>
                </div>
              </form>
            )}
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
