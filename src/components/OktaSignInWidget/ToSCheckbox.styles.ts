import { css } from 'emotion';
import { Theme } from '@mui/material';

export const getStyles = ({ spacing }: Theme) => ({
  marketingLabel: css`
    margin-bottom: ${spacing(1)} !important;
    font-size: 0.75rem !important;
  `,
  tosLink: css`
    text-decoration: none !important;
    color: #007dc1 !important;
  `,
});
