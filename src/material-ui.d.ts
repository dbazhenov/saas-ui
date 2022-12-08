// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { InputLabelProps } from '@mui/material';

declare module '@mui/material' {
  interface InputLabelProps {
    'data-testid'?: string;
  }
}
