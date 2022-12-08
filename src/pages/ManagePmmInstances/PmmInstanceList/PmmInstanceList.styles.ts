import { css } from 'emotion';
import { Theme } from '@mui/material';

export const getStyles = ({ spacing }: Theme) => ({
  tableWrapper: css`
    padding: ${spacing(1)};
  `,
  emptyMessage: css`
    display: flex;
    height: 100%;
    justify-content: center;
    align-items: center;
  `,
});
