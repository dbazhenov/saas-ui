import { css } from 'emotion';
import { Theme } from '@mui/material';

export const getStyles = ({ palette, spacing, typography }: Theme) => ({
  cardsContainer: css`
    display: flex;
    flex-wrap: wrap;
    flex: 1;
    margin: ${spacing(2)} ${spacing(2)} 0 0;
    padding: ${spacing(3)} ${spacing(3)} 0 ${spacing(3)};
  `,
  card: css`
    @media (max-width: 850px) {
      flex: 0 0 100%;
    }

    &:first-child {
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
    margin: 0;
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
    margin-top: ${spacing(2)};
    margin-bottom: 0;
  `,
  formatListBulletedIcon: css`
    font-size: 0.9em !important;
  `,
});
