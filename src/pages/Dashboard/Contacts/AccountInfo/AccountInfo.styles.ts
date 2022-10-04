import { css } from 'emotion';
import { GrafanaTheme } from '@grafana/data';

export const getStyles = ({ palette, spacing, colors, typography }: GrafanaTheme) => ({
  cardsContainer: css`
    display: flex;
    flex-wrap: wrap;
    margin-top: ${spacing.base * 7}px;
  `,
  card: css`
    color: ${colors.text};
    flex: 0 1 35%;
    background-color: ${colors.bg3};

    @media (max-width: 850px) {
      flex: 0 0 100%;
    }

    &:first-child {
      margin-right: ${spacing.lg};

      @media (max-width: 850px) {
        margin: 0;
        margin-bottom: ${spacing.lg};
      }
    }
  `,
  cardOverlay: css`
    height: 100%;
    padding: ${spacing.lg};

    & > div:first-child {
      top: 0;
      left: 0;
    }
  `,
  cardTitle: css`
    margin-top: 0;
    font-size: ${typography.size.lg};
    font-weight: ${typography.weight.bold};
  `,
  cardPoint: css`
    font-weight: ${typography.weight.semibold};
  `,
  contactBtn: css`
    text-decoration: none;
  `,
  externalLink: css`
    color: ${colors.linkExternal};
  `,
  entitlementsWrapper: css`
    display: flex;
  `,
  icon: css`
    cursor: pointer;
    margin-left: ${spacing.md};

    svg {
      color: ${palette.blue80};
    }
  `,
});
