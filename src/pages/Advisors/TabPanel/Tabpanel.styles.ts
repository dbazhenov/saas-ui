import { css } from 'emotion';
import { Theme } from '@mui/material';

export const getStyles = ({ spacing, palette }: Theme) => ({
  tableWrapper: css`
    margin-top: ${spacing(1)};
  `,
  accordianSummary: css`
    width: 33%;
    display: flex;
    flex-shrink: 0;
    align-items: center;
  `,
  accordianDescription: css`
    color: ${palette.text.secondary};
    width: 60%;
  `,
});
