import { css } from 'emotion';
import { GrafanaTheme } from '@grafana/data';

export const getStyles = (theme: GrafanaTheme) => {
  const { border, colors, spacing, isLight, typography } = theme;

  const borderColor = isLight ? colors.border1 : colors.border2;

  return {
    pageWrapper: css`
      position: relative;
    `,
    banner: css`
      position: fixed;
      top: 130px;
      right: ${spacing.md};
      width: 600px;
      background-color: ${colors.bg1}ef;
      padding: ${spacing.lg};
      border-radius: ${border.radius.lg};
      color: ${colors.text};
      border: 1px solid ${borderColor};
      z-index: 99;
    `,
    title: css`
      font-size: ${typography.size.lg};
      font-weight: ${typography.weight.bold};
      margin: 0 0 ${spacing.sm} 0;
    `,
    description: css`
      margin: 0;
    `,
    buttonsWrapper: css`
      text-align: right;
      margin-top: ${spacing.md};
    `,
    firstButton: css`
      margin-right: ${spacing.sm};
    `,
  };
};
