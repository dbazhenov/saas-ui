import { css } from 'emotion';
import { Theme } from '@mui/material';

export const getStyles = ({ palette, spacing, typography }: Theme) => ({
  cardsContainer: css`
    display: flex;
    flex-wrap: wrap;
  `,
  promoCard: css`
    flex: 1 1 calc(65% - ${spacing(3)});

    @media (max-width: 850px) {
      flex: 0 0 100%;
    }

    &:first-child {
      margin-right: ${spacing(3)};

      @media (max-width: 850px) {
        margin: 0;
        margin-bottom: ${spacing(3)};
      }
    }
  `,
  promoBannerContainer: css`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    padding: ${spacing(3)};
    color: ${palette.common.white};
    background: linear-gradient(to right, #2a83d4, #8bbdda);
  `,
  cardTitle: css`
    font-size: ${typography.h6.fontSize} !important;
    font-weight: ${typography.fontWeightBold} !important;
    margin-bottom: ${spacing(1)};
    margin-top: 0;
  `,
  boldPoint: css`
    font-weight: ${typography.fontWeightBold};
  `,
  buttonContainer: css`
    display: flex;
    justify-content: flex-end;
  `,
  contactBtn: css`
    text-decoration: none;
  `,
  list: css`
    margin-left: ${spacing(3)} !important;
    margin-bottom: ${spacing(1.5)} !important;
    line-height: ${typography.body1.lineHeight};
    list-style: disc !important;

    li {
      margin-bottom: 5px;
    }

    p {
      margin: 0;
    }
  `,
});
