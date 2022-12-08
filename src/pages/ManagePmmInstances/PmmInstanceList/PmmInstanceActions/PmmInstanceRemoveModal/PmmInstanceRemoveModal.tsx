import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { Button } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { SimpleDialog } from 'components';
import { getIsOrgPending } from 'store/orgs';
import { Messages } from './PmmInstanceRemoveModal.messages';
import { PmmInstallRemoveModalProps } from './PmmInstanceRemoveModal.types';

export const PmmInstanceRemoveModal: FC<PmmInstallRemoveModalProps> = ({
  instance,
  isVisible,
  onClose,
  onSubmit,
}) => {
  const pending = useSelector(getIsOrgPending);

  const DialogActions = (
    <>
      <Button onClick={onClose} data-testid="remove-instance-cancel-button">
        {Messages.cancel}
      </Button>
      <LoadingButton
        data-testid="remove-instance-submit-button"
        onClick={onSubmit}
        loading={pending}
        disabled={pending}
        color="warning"
      >
        {Messages.confirm}
      </LoadingButton>
    </>
  );

  return (
    <SimpleDialog
      title={Messages.removeInstanceTitle}
      text={Messages.removeInstance(instance.name)}
      open={isVisible}
      onClose={onClose}
      actions={DialogActions}
    />
  );
};
