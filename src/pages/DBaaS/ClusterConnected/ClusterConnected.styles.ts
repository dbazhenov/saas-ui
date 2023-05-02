import { Theme } from '@mui/material';
import { css } from 'emotion';

export const getStyles = ({ spacing, typography, palette }: Theme) => ({
  defaultText: css`
    margin-bottom: ${spacing(2)};
    background-color: ${palette.success.main} !important;
    border: 1px solid ${palette.success.dark} !important;
    color: ${palette.success.contrastText} !important;
    font-size: ${typography.h5.fontSize}px;
    font-weight: ${typography.fontWeightMedium} !important;
  `,
  successfulMessageDetails: css`
    margin: ${spacing(1)} 0 ${spacing(2)} 0;
    font-size: ${typography.h5.fontSize}px;
  `,
  copyButton: css`
    margin-right: ${spacing(2.375)} !important;
    font-size: ${typography.h5.fontSize}px;
  `,
  goButton: css`
    text-decoration: none !important;
    color: ${palette.success.contrastText} !important;
    margin-top: ${spacing(0.5)} !important;
    margin-right: ${spacing(1.5)} !important;
  `,
  viewConfigLink: css`
    text-decoration: none !important;
    font-size: ${typography.h5.fontSize}px;
    font-weight: ${typography.fontWeightMedium} !important;
  `,
  loader: css`
    text-align: center;
  `,
});
