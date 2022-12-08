import { css } from 'emotion';
import { Theme } from '@mui/material';
import { blueGrey } from '@mui/material/colors';

export const getStyles = ({ palette, spacing, typography }: Theme) => ({
  cardsContainer: css`
    display: flex;
    flex-wrap: wrap;
    margin-top: ${spacing(3)};
  `,
  card: css`
    flex: 0 1 35%;
    padding: ${spacing(3)};
    background-color: ${palette.mode === 'light' ? blueGrey[50] : blueGrey[900]};

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
    font-size: ${typography.h6.fontSize};
    font-weight: ${typography.fontWeightBold};
  `,
  cardPoint: css`
    font-weight: ${typography.fontWeightMedium};
  `,
  contactBtn: css`
    text-decoration: none;
  `,
  externalLink: css`
    color: ${palette.primary.main};
  `,
  entitlementsWrapper: css`
    display: flex;
    margin-top: 0;
  `,
  icon: css`
    cursor: pointer;
    margin-left: ${spacing(2)};

    svg {
      color: ${palette.primary.main};
    }
  `,
  paragraph: css`
    margin: 16px 0 !important;
  `,
  noBottomMargin: css`
    margin-bottom: 0;
  `,
  formatListBulletedIcon: css`
    font-size: 0.9em !important;
  `,
});
