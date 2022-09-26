import React, { FC, useCallback } from 'react';
import { Modal } from '@percona/platform-core';
import { toast } from 'react-toastify';
import { useStyles, Button, HorizontalGroup, TextArea } from '@grafana/ui';
import { copyToClipboard } from 'core';
import { getStyles } from './KubeconfigModal.styles';
import { Messages } from './KubeconfigModal.messages';
import { KubeconfigModalProps } from './KubeconfigModal.types';

export const KubeconfigModal: FC<KubeconfigModalProps> = ({ kubeconfig, isVisible, onClose }) => {
  const styles = useStyles(getStyles);

  const handleCopyToClipboard = useCallback(async () => {
    await copyToClipboard(kubeconfig);
    toast.success(Messages.copySuccessful);
  }, [kubeconfig]);

  return (
    <div className={styles.modalWrapper}>
      <Modal title={Messages.k8sClusterConfiguration} isVisible={isVisible} onClose={onClose}>
        <TextArea
          data-testid="kubernetes-cluster-config-modal-textarea"
          className={styles.textArea}
          name="kubeconfig-yaml"
          readOnly
          value={kubeconfig}
        />
        <HorizontalGroup justify="flex-end">
          <Button
            variant="primary"
            size="md"
            onClick={handleCopyToClipboard}
            data-testid="kubeconfig-copy-button"
          >
            {Messages.copyToClipboard}
          </Button>
        </HorizontalGroup>
      </Modal>
    </div>
  );
};
