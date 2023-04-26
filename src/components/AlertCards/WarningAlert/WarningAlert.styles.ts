import { Theme } from '@mui/material';
import { css } from 'emotion';

export const getStyles = ({ spacing, typography, palette }: Theme) => ({
  joinOrg: css`
    width: 100%;
  `,
  wrapper: css`
    max-width: 100%;
    margin: 0 auto;
  `,
  card: css`
    background-color: ${palette.warning.main} !important;
    color: ${palette.warning.contrastText} !important;
    border: 1px solid ${palette.warning.dark};
    max-width: 100%;
    padding: ${spacing(2)};
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: ${spacing(2)};
    align-items: center;
  `,
  text: css`
    display: flex;
    flex-direction: column;
  `,
  warningMessage: css`
    font-weight: ${typography.fontWeightMedium};
    display: flex;
    flex-direction: row;
    align-items: center;
  `,
  link: css`
    color: ${palette.warning.contrastText} !important;
    font-size: ${typography.fontSize}px;
    font-weight: ${typography.fontWeightMedium};
    width: 134px;
  `,
  description: css`
    margin: 0 ${spacing(2)} 0 ${spacing(4)};
    font-size: ${typography.fontSize}px;
  `,
  warningIcon: css`
    width: ${spacing(3)} !important;
    margin-right: ${spacing(1)};
  `,
});
