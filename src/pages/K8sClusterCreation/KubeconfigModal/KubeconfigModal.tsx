import React, { FC, useCallback } from 'react';
import { toast } from 'react-toastify';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { useStyles } from 'core/utils';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { copyToClipboard } from 'core';
import { Messages } from './KubeconfigModal.messages';
import { KubeconfigModalProps } from './KubeconfigModal.types';
import { getStyles } from './KubeconfigModal.styles';
import { TEXTAREA_ROWS } from './KuberconfigModal.constants';

export const KubeconfigModal: FC<KubeconfigModalProps> = ({ kubeconfig, isVisible, onClose }) => {
  const styles = useStyles(getStyles);

  const handleCopyToClipboard = useCallback(async () => {
    await copyToClipboard(kubeconfig);
    toast.success(Messages.copySuccessful);
  }, [kubeconfig]);

  return (
    <div>
      <Dialog
        open={isVisible}
        onClose={onClose}
        fullWidth
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        maxWidth="md"
      >
        <DialogTitle className={styles.dialogTitle}>
          <span className={styles.dialogTitleText}>{Messages.k8sClusterConfiguration}</span>
          <IconButton onClick={onClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent className={styles.dialogContent}>
          <TextField
            data-testid="kubernetes-cluster-config-modal-textarea"
            className={styles.textArea}
            name="kubeconfig-yaml"
            fullWidth
            value={kubeconfig}
            multiline
            rows={`${TEXTAREA_ROWS}`}
            InputProps={{ readOnly: true }}
          />
        </DialogContent>
        <DialogActions className={styles.dialogActions}>
          <Button
            onClick={handleCopyToClipboard}
            data-testid="kubeconfig-copy-button"
            variant="contained"
            className={styles.copyClipboardBtn}
          >
            {Messages.copyToClipboard}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
