import { css } from 'emotion';
import { Theme } from '@mui/material';

export const getStyles = ({ spacing, palette }: Theme) => ({
  wrapper: css`
    align-items: center;
    display: flex;
  `,
  label: css`
    width: 150px;
  `,
  timesIcon: css`
    color: ${palette.error.main};
    margin-left: ${spacing(2)};
  `,
  checkIcon: css`
    color: ${palette.success.main};
    margin-left: ${spacing(2)};
  `,
});
