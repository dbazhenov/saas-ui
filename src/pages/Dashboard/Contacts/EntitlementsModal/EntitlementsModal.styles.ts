import { css } from 'emotion';
import { Theme } from '@mui/material';
import blue from '@mui/material/colors/blue';

export const getStyles = ({ palette, typography, spacing }: Theme) => ({
  modal: css`
    position: absolute;
    background-color: ${palette.background.paper};
    width: 90vw;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: ${spacing(3)};
  `,
  title: css`
    font-size: ${typography.h6.fontSize} !important;
    font-weight: ${typography.fontWeightMedium} !important;
    margin-bottom: ${spacing(2)} !important;
  `,
  accordionTitle: css`
    flex: 1;
    display: flex;
    justify-content: space-between;
    align-items: center;
  `,
  expiryDate: css`
    color: ${blue[700]} !important;
    font-size: ${typography.caption.fontSize} !important;
    margin-right: ${spacing(1)} !important;
  `,
  wrapper: css`
    padding-left: ${spacing(4)};
    position: relative;
    span {
      font-weight: ${typography.fontWeightBold};
      margin-right: ${spacing(0.5)};
    }

    p {
      margin: 0;
      margin-bottom: ${spacing(0.5)};

      &:nth-child(2) {
        margin-bottom: ${spacing(2)};
      }
    }
  `,
  advisorsWrapper: css`
    margin-left: ${spacing(1)};
  `,
});
