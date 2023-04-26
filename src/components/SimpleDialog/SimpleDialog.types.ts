import { Breakpoint, DialogClasses, DialogProps } from '@mui/material';
import { ReactNode } from 'react';

export interface SimpleDialogProps extends DialogProps {
  actions: ReactNode;
  open: boolean;
  onClose: () => void;
  title: string;
  text?: string;
  maxWidth?: Breakpoint;
  classes?: Partial<DialogClasses>;
  fullWidth?: boolean;
}
