import { css } from 'emotion';
import { Theme } from '@mui/material';

export const getStyles = ({ spacing }: Theme) => ({
  tableWrapper: css`
    margin-top: ${spacing(1)};
  `,
});
