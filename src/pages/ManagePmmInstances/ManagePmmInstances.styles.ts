import { css } from 'emotion';
import { Theme } from '@mui/material';

export const getStyles = ({ palette, typography, spacing, shape }: Theme) => ({
  container: css`
    color: ${palette.text.primary};
    display: flex;
    flex-direction: column;
    flex: 1;

    header {
      align-items: center;
      display: flex;
      font-weight: ${typography.fontWeightRegular};
      font-size: ${typography.h2.fontSize};
      margin: 0 0 ${spacing(2)};

      svg {
        height: 28px;
        margin-right: ${spacing(2)};
      }
    }
  `,
  contentWrapper: css`
    background-color: ${palette.background.default};
    border-radius: ${shape.borderRadius};
    padding: ${spacing(3)};
  `,
  linkWrapper: css`
    text-align: right;
    padding: ${spacing(1)};
  `,
  externalLink: css`
    color: ${palette.primary.main};
  `,
});
