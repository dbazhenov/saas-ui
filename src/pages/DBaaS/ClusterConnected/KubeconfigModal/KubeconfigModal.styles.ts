import { css } from 'emotion';
import { Theme } from '@mui/material';

export const getStyles = ({ spacing }: Theme) => ({
  // XXX: temporary workaround to fix Modal's dark theme
  textArea: css`
    height: 400px;
    resize: none;
    margin-bottom: ${spacing(3)};
  `,
});
