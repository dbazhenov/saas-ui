import React, { FC } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { SimpleDialogProps } from './SimpleDialog.types';

export const SimpleDialog: FC<SimpleDialogProps> = ({
  open,
  children,
  title,
  text,
  onClose,
  actions,
  ...rest
}) => (
  <div data-testid="modal-wrapper">
    <Dialog open={open} onClose={onClose} data-testid="modal-body" {...rest}>
      <DialogTitle data-testid="modal-header">{title}</DialogTitle>
      <DialogContent data-testid="modal-content">
        <DialogContentText>{text}</DialogContentText>
        {children}
      </DialogContent>
      <DialogActions data-testid="modal-actions">{actions}</DialogActions>
    </Dialog>
  </div>
);
