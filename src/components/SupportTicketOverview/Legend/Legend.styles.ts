import { css } from 'emotion';
import { Theme } from '@mui/material';
import { lightBlue, blue, blueGrey } from '@mui/material/colors';

export const getStyles = ({ spacing, typography, palette }: Theme) => ({
  legend: css`
    display: flex;
    flex: 1;
    padding-right: ${spacing(3)};
    flex-direction: column;
  `,
  row: css`
    display: flex;
    flex: 1;
  `,
  item: css`
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: center;
    padding-right: ${spacing(2)};
  `,
  alignTop: css`
    justify-content: flex-start;
  `,
  colorNameNumber: css`
    display: flex;
    align-items: center;

    strong {
      font-weight: ${typography.fontWeightBold} !important;
      margin-left: ${spacing(3)};
    }
  `,
  color: css`
    display: inline-block;
    width: 15px;
    height: 15px;
    border-radius: 8px;
    margin-right: 8px;
  `,
  tagList: css`
    display: flex;
    flex-wrap: wrap;
  `,
  tag: css`
    background-color: ${palette.mode === 'light' ? lightBlue[50] : blueGrey[900]} !important;
    border: 1px solid ${palette.mode === 'light' ? blue[200] : lightBlue[700]} !important;
    font-size: ${typography.caption.fontSize} !important;
    color: ${palette.mode === 'light' ? blue[700] : lightBlue[700]} !important;
    margin-top: ${spacing(1)};
    margin-right: ${spacing(0.5)};
  `,
});
