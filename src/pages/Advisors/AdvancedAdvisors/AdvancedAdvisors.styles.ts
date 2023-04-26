import { Theme } from '@mui/material';
import { css } from 'emotion';

export const getStyles = ({ spacing, palette, typography }: Theme) => ({
  advisorsWrapper: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: ${spacing(2)};
  `,
  advisorsContent: css`
    width: 90%;
    display: flex;
    flex-direction: column;
    padding: ${spacing(2)} ${spacing(3)} ${spacing(3)} ${spacing(3)};
    background-color: ${palette.secondary.light} !important;
    border-radius: 4px 4px 0px 0px;
    border-top: ${spacing(1)} solid ${palette.primary.main};
  `,
  title: css`
    align-self: flex-start;
    font-size: ${typography.h5.fontSize};
    font-weight: ${typography.fontWeightBold};
  `,
  closeBtn: css`
    align-self: flex-end;
  `,
  advisorsHeader: css`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: ${spacing(2)};
  `,
  contactSalesBtn: css`
    width: 154px;
    height: 42px;
    margin-top: ${spacing(3)} !important;
    align-self: center;
  `,
  advisor: css`
    margin-bottom: ${spacing(1)};
  `,
});
