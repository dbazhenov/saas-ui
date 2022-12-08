import { css } from 'emotion';
import { Theme } from '@mui/material';

export const getStyles = ({ spacing }: Theme) => ({
  textField: css`
    margin-top: ${spacing(1)} !important;
  `,
});
