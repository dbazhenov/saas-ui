import { css } from 'emotion';
import { Theme } from '@mui/material';

export const getStyles = ({ palette }: Theme) => ({
  wrapper: css`
    position: relative;
  `,
  centeredElement: css`
    position: absolute;
    display: flex;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    justify-content: center;
    align-items: center;
  `,
  path: css`
    stroke: ${palette.background.default};
  `,
});
