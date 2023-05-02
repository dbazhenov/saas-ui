import { Theme } from '@mui/material';
import { css } from 'emotion';

export const getStyles = ({ spacing }: Theme) => ({
  dialogActionSpacing: css`
    padding: 0 ${spacing(2)} ${spacing(2)} 0 !important;
  `,
  modalBackdrop: css`
    backdrop-filter: blur(2px);
  `,
});
