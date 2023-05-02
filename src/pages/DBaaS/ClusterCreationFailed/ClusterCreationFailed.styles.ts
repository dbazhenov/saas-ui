import { Theme } from '@mui/material';
import { css } from 'emotion';

export const getStyles = ({ spacing, typography, palette }: Theme) => ({
  defaultText: css`
    width: 100%;
    background-color: ${palette.error.main} !important;
    color: ${palette.error.contrastText} !important;
    font-size: ${typography.fontSize}px;
    font-weight: ${typography.fontWeightMedium} !important;
    margin-bottom: ${spacing(2)};
    border: 1px solid ${palette.error.dark} !important;
  `,
  loader: css`
    text-align: center;
  `,
});
