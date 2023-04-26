import { css } from 'emotion';
import { Theme } from '@mui/material';

export const getStyles = ({ palette, spacing, typography }: Theme) => ({
  cardsContainer: css`
    display: flex;
    flex-wrap: wrap;
    flex: 1;
    padding: ${spacing(3)};
  `,
  contactsCard: css`
    flex: 1 1 35%;

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
  cardOverlay: css`
    height: 100%;
    padding: ${spacing(3)};

    & > div:first-child {
      top: 0;
      left: 0;
    }
  `,
  cardTitle: css`
    margin-top: 0;
    font-size: ${typography.h6.fontSize} !important;
    font-weight: ${typography.fontWeightBold} !important;
  `,
  externalLink: css`
    display: block;
    color: ${palette.primary.main};
  `,
  label: css`
    margin-right: ${spacing(0.5)};
  `,
  mailLink: css`
    display: block;
    margin-top: 5px;
  `,
  needHelp: css`
    margin: ${spacing(2)} 0;
  `,
});
