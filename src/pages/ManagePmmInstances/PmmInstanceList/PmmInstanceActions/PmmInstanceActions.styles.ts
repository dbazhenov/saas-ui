import { css } from 'emotion';
import { Theme } from '@mui/material';

export const getStyles = ({ palette, spacing }: Theme) => ({
  actionButton: css`
    color: ${palette.text.primary};
    cursor: pointer;

    &:not(:first-child) {
      margin-left: ${spacing(1)};
    }
  `,
  actionsWrapper: css`
    display: flex;
    align-content: center;
    justify-content: center;
  `,
});
