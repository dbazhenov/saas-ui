import { css } from 'emotion';
import { Theme } from '@mui/material';

export const getStyles = ({ palette, spacing, typography }: Theme) => ({
  marginSection: css`
    margin-top: ${spacing(4)};
  `,
  container: css`
    background-color: ${palette.background.default};
  `,
  containerPadding: css`
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: ${spacing(3)};
  `,
  headerFont: css`
    font-weight: ${typography.fontWeightMedium} !important;
  `,
  centeredElement: css`
    text-align: center;

    strong {
      font-size: ${typography.h4.fontSize} !important;
      font-weight: ${typography.fontWeightBold};
    }

    p {
      margin: 0;
    }
  `,
});
