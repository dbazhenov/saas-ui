import { ReactNode } from 'react';

export interface SimpleDialogProps {
  actions: ReactNode;
  open: boolean;
  onClose: () => void;
  title: string;
  text?: string;
}
