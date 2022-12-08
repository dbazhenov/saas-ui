import { Theme } from '@mui/material';
import { css } from 'emotion';
import { blueGrey } from '@mui/material/colors';

export const getStyles = ({ spacing, typography, palette }: Theme) => ({
  wrapper: css`
    display: flex;
    flex: 1;
    justify-content: center;
    height: 100%;
    min-height: 100vh;
    padding: ${spacing(2)};
  `,
  wrapperInvalid: css`
    display: flex;
    flex: 1;
    justify-content: center;
    height: 100%;
    min-height: 100vh;
    padding: ${spacing(4)};
  `,
  container: css`
    flex: 1;
    max-width: ${spacing(137)};
    margin-top: ${spacing(9)};
  `,
  containerInvalid: css`
    flex: 1;
    max-width: ${spacing(100)};
    margin-top: ${spacing(10)};
  `,
  flexColumn: css`
    display: flex;
    flex: 1;
    flex-direction: column;
  `,
  h1: css`
    padding: 0;
    margin: 0;
    font-size: 32px !important;
    line-height: 32px !important;
    font-weight: ${typography.fontWeightBold} !important;
  `,
  h2: css`
    padding: 0;
    margin: 0;
    margin-top: -4px;
    margin-bottom: ${spacing(4)} !important;
    font-weight: ${typography.fontWeightLight} !important;
    font-size: 32px !important;
  `,
  content: css`
    padding: ${spacing(3)};
    background-color: ${blueGrey[50]};

    input {
      max-width: 300px;
    }
  `,
  title: css`
    display: inline-block;
    font-size: 26px !important;
    font-weight: ${typography.fontWeightMedium} !important;
    margin: ${spacing(1)} 0 ${spacing(1)} 0 !important;
  `,
  description: css`
    padding: ${spacing(1)} 0 0 0 !important;
    color: ${palette.text.primary};
    margin-bottom: ${spacing(2)} !important;
  `,
  columns: css`
    display: flex;
    margin-bottom: ${spacing(2)};
    gap: ${spacing(3)};
  `,
  firstColumn: css`
    flex: 1;
    max-width: ${600 + spacing(3)};
    display: flex;
    flex-direction: column;
    gap: ${spacing(1)};
  `,
  minWidth: css`
    width: fit-content;
    flex: unset !important;
  `,
  row: css`
    display: flex;
    flex: 1;
    gap: ${spacing(3)};
    & > * {
      flex: 1;
      max-width: 300px;
    }
  `,
  infoContainer: css`
    display: flex;
    align-items: center;
    gap: 5px;
  `,
  passwordListTitle: css`
    line-height: 20px;
    font-weight: ${typography.fontWeightMedium} !important;
    margin: 0;
  `,
  infoIcon: css`
    font-size: 24px !important;
    font-weight: ${typography.fontWeightMedium} !important;
    cursor: default;
    user-select: none;
  `,
  passwordList: css`
    margin-left: ${spacing(3)};
    line-height: 18px;
    font-size: 12px !important;
  `,
  externalLink: css`
    color: ${palette.primary.main};
  `,
  formFooter: css`
    display: flex;
    flex: 1;
    justify-content: space-between;
    align-items: center;
  `,
  helpIcon: css`
    border: 1px solid ${palette.primary.main} !important;
    border-radius: 100%;
    font-size: 12px !important;
    font-weight: ${typography.fontWeightBold} !important;
    text-align: center;
    line-height: 12px;
    width: 14px;
    padding-left: 1px;
    user-select: none;
  `,
  center: css`
    display: flex;
    flex: 1;
    justify-content: center;
  `,
  goToHome: css`
    margin-top: ${spacing(2)} !important;
  `,
});
