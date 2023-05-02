import { Theme } from '@mui/material';
import { css } from 'emotion';

export const getStyles = ({ spacing, typography }: Theme) => ({
  content: css`
    width: 100%;
  `,
  mainSection: css`
    margin-bottom: ${spacing(2)};
  `,
  progressDetails: css`
    font-size: ${typography.body2.fontSize};
    margin-top: ${spacing(0.5)};
  `,
});
