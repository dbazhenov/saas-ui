import { css } from 'emotion';
import { Theme } from '@mui/material';

export const getStyles = ({ spacing }: Theme) => ({
  tableWrapper: css`
    margin-top: ${spacing(3)};
  `,
  scrollableCell: css`
    overflow-x: scroll;
    scrollbar-width: none;
  `,
  filters: css`
    display: flex;
    align-items: flex-start;
    margin-bottom: ${spacing(1)};
  `,
});
