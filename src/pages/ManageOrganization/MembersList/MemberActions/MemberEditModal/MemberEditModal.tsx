import React, { FC, useState } from 'react';
import { useSelector } from 'react-redux';
import { LoadingButton } from '@mui/lab';
import { FormRenderProps, withTypes } from 'react-final-form';
import { TextField } from 'mui-rff';
import { Button, MenuItem } from '@mui/material';
import { useStyles } from 'core/utils';
import { getIsOrgPending } from 'store/orgs';
import { SimpleDialog } from 'components';
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
  const initialValues = { role, email, name: `${firstName} ${lastName}` };
  const [formValid, setFormValid] = useState(false);
  const [formPristine, setFormPristine] = useState(true);
  let formSubmit = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {};

  const DialogActions = (
    <>
      <Button data-testid="edit-member-cancel-button" type="button" onClick={onClose}>
        {Messages.cancel}
      </Button>
      <LoadingButton
        data-testid="edit-member-submit-button"
        loading={pending}
        disabled={!formValid || pending || formPristine}
        color="warning"
        onClick={(event) => formSubmit(event)}
      >
        {Messages.save}
      </LoadingButton>
    </>
  );

  return (
    <SimpleDialog title={Messages.editMember} open={isVisible} onClose={onClose} actions={DialogActions}>
      <Form onSubmit={onSubmit} initialValues={initialValues}>
        {({ handleSubmit, valid, pristine }: FormRenderProps) => {
          setFormPristine(pristine);
          setFormValid(valid);
          formSubmit = handleSubmit;

          return (
            <form onSubmit={handleSubmit} className={styles.editForm} data-testid="edit-member-form">
              <TextField fullWidth={false} name="name" label={Messages.name} disabled />
              <TextField fullWidth={false} name="email" label={Messages.email} disabled />
              <TextField
                fullWidth={false}
                select
                name="role"
                label={Messages.role}
                className={styles.select}
                data-testid="role-select"
              >
                {ROLES.map((r) => (
                  <MenuItem key={r.value} value={r.value}>
                    {r.label}
                  </MenuItem>
                ))}
              </TextField>
            </form>
          );
        }}
      </Form>
    </SimpleDialog>
  );
};
