import { css } from 'emotion';
import { Theme } from '@mui/material';

export const getStyles = ({ palette, shape, shadows }: Theme) => ({
  authCenter: css`
    display: flex;
    flex-direction: column;
    background-color: ${palette.common.white};
    border-radius: ${shape.borderRadius}px;
    box-shadow: ${shadows[10]};
  `,
  authState: css`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
  `,
  loader: css`
    position: absolute;
  `,
});
