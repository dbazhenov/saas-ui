import { css } from 'emotion';
import { GrafanaTheme } from '@grafana/data';

export const getStyles = (theme: GrafanaTheme) => {
  const { border, colors, spacing, typography } = theme;

  return {
    sideMenu: css`
      background-color: ${colors.pageHeaderBg};
      border-right: ${border.width.sm} solid ${colors.border1};
      padding: ${spacing.xl} ${spacing.lg};
      width: 250px;
    `,
    navSectionLabel: css`
      color: ${colors.textWeak};
      font-size: ${typography.size.sm};
      margin-bottom: ${spacing.md};
    `,
    section: css`
      &:not(:first-child) {
        margin-top: ${spacing.xl};
      }
    `,
  };
};
