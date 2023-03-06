import { css } from 'emotion';
import { Theme } from '@mui/material';
import { TABLET_BREAKPOINT } from 'core/constants';

export const getStyles = ({ spacing, typography, shape }: Theme) => ({
  card: css`
    height: 100%;
    padding: ${spacing(2.5)} ${spacing(2)} ${spacing(2)} ${spacing(2)};
    width: 264px;
    background-color: white;
    border: 1px solid rgba(0, 0, 0, 0.02);
    box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px rgba(0, 0, 0, 0.14),
      0px 1px 10px rgba(0, 0, 0, 0.12) !important;
    font-size: ${typography.body2.fontSize};
    border-radius: ${shape.borderRadius}px;

    p {
      margin: ${spacing(1)} 0;
    }

    @media (max-width: ${TABLET_BREAKPOINT}) {
      width: 100%;
      padding: ${spacing(2)} ${spacing(2)} 0 ${spacing(2)};
    }
  `,
  icon: css`
    display: flex;
    align-items: center;
    justify-content: center;
    width: ${spacing(4.5)};
    height: ${spacing(4.5)};
    margin-bottom: ${spacing(3)};
  `,
});
