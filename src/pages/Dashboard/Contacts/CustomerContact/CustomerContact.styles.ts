import { css } from 'emotion';
import { Theme } from '@mui/material';

export const getStyles = ({ spacing, palette, typography }: Theme) => ({
  wrapper: css`
    display: flex;
    flex-direction: column;
  `,
  nameWrapper: css`
    align-items: center;
    display: flex;
    margin-bottom: ${spacing(1)};
  `,
  title: css`
    font-weight: ${typography.fontWeightBold};
    margin-bottom: ${spacing(1)};
  `,
  name: css`
    margin-left: ${spacing(0.5)};
    margin-right: ${spacing(2)};
  `,
  icon: css`
    cursor: pointer;
    margin-right: ${spacing(2)};

    svg {
      color: ${palette.primary.main};
    }
  `,
});
