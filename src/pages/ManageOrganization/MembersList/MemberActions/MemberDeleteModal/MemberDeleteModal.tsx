import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { Button } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { getIsOrgPending } from 'store/orgs';
import { SimpleDialog } from 'components';
import { Messages } from './MemberDeleteModal.messages';
import { MemberDeleteModalProps } from './MemberDeleteModal.types';

export const MemberDeleteModal: FC<MemberDeleteModalProps> = ({ member, isVisible, onClose, onSubmit }) => {
  const pending = useSelector(getIsOrgPending);

  return (
    <SimpleDialog
      title={Messages.deleteMemberTitle}
      text={Messages.deleteMember(member.email)}
      open={isVisible}
      onClose={onClose}
      actions={
        <>
          <Button onClick={onClose} data-testid="delete-member-cancel-button">
            {Messages.cancel}
          </Button>
          <LoadingButton
            data-testid="delete-member-submit-button"
            onClick={onSubmit}
            loading={pending}
            disabled={pending}
            color="warning"
          >
            {Messages.confirm}
          </LoadingButton>
        </>
      }
    />
  );
};
