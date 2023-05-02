import React, { FC } from 'react';
import { TextField, Button } from '@mui/material';
import { useStyles } from 'core/utils';
import { SimpleDialog } from 'components';
import { Messages } from './KubeconfigModal.messages';
import { KubeconfigModalProps } from './KubeconfigModal.types';
import { getStyles } from './KubeconfigModal.styles';
import { TEXTAREA_ROWS } from './KubeconfigModal.constants';

export const KubeconfigModal: FC<KubeconfigModalProps> = ({ kubeconfig, isVisible, onClose }) => {
  const styles = useStyles(getStyles);
  const DialogActions = (
    <>
      <Button type="button" onClick={onClose} variant="contained" data-testid="kubeconfig-modal-close-button">
        {Messages.close}
      </Button>
    </>
  );

  return (
    <div>
      <SimpleDialog
        open={isVisible}
        onClose={onClose}
        fullWidth
        maxWidth="md"
        title={Messages.k8sClusterConfiguration}
        actions={DialogActions}
      >
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
      </SimpleDialog>
    </div>
  );
};
