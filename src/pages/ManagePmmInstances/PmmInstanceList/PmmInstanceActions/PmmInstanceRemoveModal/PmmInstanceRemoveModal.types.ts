import { PmmInstance } from 'store/types';

export interface PmmInstallRemoveModalProps {
  instance: PmmInstance;
  isVisible: boolean;
  onSubmit: () => void;
  onClose: () => void;
}
