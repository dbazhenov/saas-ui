import { Theme } from '@mui/material';
import { css } from 'emotion';

export const getStyles = ({ spacing, typography, palette }: Theme) => ({
  joinOrg: css`
    width: 100%;
  `,
  wrapper: css`
    max-width: ${spacing(101.25)};
    margin: 0 auto;
  `,
  card: css`
    background-color: ${palette.warning.main} !important;
    color: ${palette.warning.contrastText} !important;
    border: 1px solid ${palette.warning.dark};
    max-width: ${spacing(101.25)};
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
  `,
  title: css`
    margin-top: -${spacing(0.375)};
  `,
  link: css`
    color: #42361d !important;
    font-size: ${typography.fontSize}px;
    font-weight: ${typography.fontWeightMedium};
    width: 134px;
  `,
  description: css`
    margin: 0 ${spacing(2)} 0 ${spacing(4)};
    font-size: ${typography.fontSize}px;
  `,
  warningIcon: css`
    margin: 0 ${spacing(1.6)} -${spacing(0.375)} 0;
  `,
});
