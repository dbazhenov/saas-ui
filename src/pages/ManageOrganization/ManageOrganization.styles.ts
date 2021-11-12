import { css } from 'emotion';
import { GrafanaTheme } from '@grafana/data';

export const getStyles = (theme: GrafanaTheme) => {
  const { border, colors, spacing, typography } = theme;

  return {
    container: css`
      color: ${colors.text};
      display: flex;
      flex-direction: column;
      flex: 1;

      header {
        align-items: center;
        display: flex;
        font-weight: ${typography.weight.regular};
        font-size: ${typography.heading.h2};
        margin: 0 0 ${spacing.md};

        svg {
          height: 28px;
          margin-right: ${spacing.md};
        }
      }
    `,
    disabledTab: css`
      cursor: not-allowed;

      > * {
        color: ${colors.linkDisabled};
        pointer-events: none;
      }
    `,
    tabsWrapper: css`
      background-color: ${colors.pageHeaderBg};
      border-radius: ${border.radius.lg};
      padding: ${spacing.lg};
    `,
  };
};
