import { css } from 'emotion';
import { Theme } from '@mui/material';

export const getStyles = ({ spacing, palette }: Theme) => ({
  title: css`
    font-size: 23px;
    color: ${palette.text.primary};
    font-weight: 600;
    margin-bottom: ${spacing(2)};
  `,
  defaultText: css`
    margin-bottom: ${spacing(2)};
  `,
});
