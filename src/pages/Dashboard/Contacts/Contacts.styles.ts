import { css } from 'emotion';
import { GrafanaTheme } from '@grafana/data';

export const getStyles = ({ palette, spacing, colors, typography }: GrafanaTheme) => ({
  cardsContainer: css`
    display: flex;
    flex-wrap: wrap;
  `,
  card: css`
    color: ${colors.text};
    flex: 1 1 35%;
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
  externalLink: css`
    color: ${colors.linkExternal};
  `,
  label: css`
    margin-right: ${spacing.xs};
  `,
  mailLink: css`
    display: block;
    margin-top: 5px;
  `,
});
