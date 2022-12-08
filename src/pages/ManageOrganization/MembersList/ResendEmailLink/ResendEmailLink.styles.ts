import { css } from 'emotion';
import { Theme } from '@mui/material';

export const getStyles = ({ spacing }: Theme) => ({
  link: css`
    margin-left: ${spacing(1)} !important;
    text-decoration: none !important;
    cursor: pointer;
  `,
  paragraphWrapper: css`
    margin: 0;
    line-height: ${spacing(3)};
    display: flex;
  `,
  loader: css`
    height: 20px !important;
    width: 20px !important;
    margin-left: ${spacing(5)} !important;
  `,
});
