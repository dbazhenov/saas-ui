import { css } from 'emotion';
import { GrafanaTheme } from '@grafana/data';

export const getStyles = (theme: GrafanaTheme) => {
  const { colors, isLight, spacing, typography } = theme;

  const borderColor = isLight ? colors.border1 : colors.border2;

  return {
    header: css`
      align-items: center;
      display: flex;
      font-weight: ${typography.weight.regular};
      font-size: ${typography.heading.h2};
      margin: 0 0 ${spacing.xl};
    `,
    container: css`
      align-items: center;
      display: flex;
      flex-direction: column;
      justify-content: center;
      line-height: 2em;
      margin-bottom: ${spacing.xl};
      padding: 0 56px;

      > :not(:first-child) {
        margin-top: ${spacing.lg};
      }

      > :not(:last-child) {
        border-bottom: 1px solid ${borderColor};
        padding-bottom: ${spacing.lg};
      }
    `,
  };
};
