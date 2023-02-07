import { css } from 'emotion';
import { Theme } from '@mui/material';

export const getStyles = ({ spacing, shape, typography, palette }: Theme) => ({
  pageWrapper: css`
    position: relative;
  `,
  banner: css`
    position: fixed;
    top: 130px;
    right: ${spacing(2)};
    width: 600px;
    background-color: ${palette.background.default};
    padding: ${spacing(3)};
    border-radius: ${shape.borderRadius}px;
    border: 1px solid ${palette.divider};
    z-index: 99;
  `,
  title: css`
    font-size: ${typography.h5.fontSize};
    font-weight: ${typography.fontWeightBold};
    margin: 0 0 ${spacing(1)} 0;
  `,
  description: css`
    margin: 0;
  `,
  buttonsWrapper: css`
    justify-content: flex-end;
    display: flex;
    text-align: right;
    margin-top: ${spacing(2)};

    & > :not(:last-child) {
      margin-right: ${spacing(1)};
    }
  `,
  firstButton: css`
    margin-right: ${spacing(1)};
  `,
});
