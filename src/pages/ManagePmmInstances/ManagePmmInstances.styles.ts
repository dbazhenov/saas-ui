import { css } from 'emotion';
import { Theme } from '@mui/material';

export const getStyles = ({ palette, typography, spacing, shape }: Theme) => ({
  container: css`
    color: ${palette.text.primary};
    display: flex;
    flex-direction: column;
    flex: 1;
  `,
  contentWrapper: css`
    background-color: ${palette.background.default};
    border-radius: ${shape.borderRadius};
    padding: 0 ${spacing(3)};
  `,
  linkWrapper: css`
    text-align: right;
    padding: ${spacing(1)};
  `,
  externalLink: css`
    color: ${palette.primary.main};
  `,
});
