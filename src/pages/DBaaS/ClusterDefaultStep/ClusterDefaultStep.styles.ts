import { Theme } from '@mui/material';
import { css } from 'emotion';

export const getStyles = ({ spacing }: Theme) => ({
  defaultText: css`
    margin-bottom: ${spacing(2)};
  `,
  loader: css`
    text-align: center;
  `,
});
