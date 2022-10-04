import { css } from 'emotion';
import { GrafanaTheme } from '@grafana/data';

export const getStyles = ({ palette, spacing, colors, typography }: GrafanaTheme) => ({
  cardsContainer: css`
    display: flex;
    flex-wrap: wrap;
  `,
  promoCard: css`
    color: ${colors.text};
    flex: 1 1 calc(65% - ${spacing.lg});
    background-color: ${palette.gray6};

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
  promoBannerContainer: css`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    padding: ${spacing.lg};
    color: ${palette.white};
    background: linear-gradient(to right, #2a83d4, #8bbdda);
  `,
  cardTitle: css`
    font-size: ${typography.heading.h3};
    font-weight: ${typography.weight.bold};
    margin-bottom: ${spacing.base}px;
    margin-top: 0;
  `,
  boldPoint: css`
    font-weight: ${typography.weight.bold};
  `,
  buttonContainer: css`
    display: flex;
    justify-content: flex-end;
  `,
  contactBtn: css`
    text-decoration: none;
  `,
  list: css`
    margin-left: ${spacing.base * 3 - 2}px;
    margin-bottom: ${spacing.base + 4}px;
    line-height: ${typography.lineHeight.md - 0.1};

    li {
      margin-bottom: 5px;
    }

    p {
      margin: 0;
    }
  `,
});
