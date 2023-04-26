import { Theme } from '@mui/material';
import { css } from 'emotion';

export const getStyles = ({ spacing }: Theme) => ({
  infoButton: css`
    display: flex;
    justify-content: flex-end;
    margin-bottom: ${spacing(1)};
    align-self: flex-end;
  `,
  actions: css`
    padding: ${spacing(1)};
  `,
  root: css`
    backdrop-filter: blur(2px);
  `,
});
