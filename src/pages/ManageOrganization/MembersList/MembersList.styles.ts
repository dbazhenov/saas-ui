import { css } from 'emotion';
import { GrafanaTheme } from '@grafana/data';

export const getStyles = ({typography, spacing}: GrafanaTheme) => ({
    fullNameWrapper: css`
      display: flex;
      align-items: center;
    `,
    fullName: css`
      margin-left: ${spacing.sm};
    `,
    clockIconWrapper: css`
      display: flex;
      align-items: center;
      justify-content: center;
    `,
    clockIcon: css`
      height: ${typography.size.md};
    `,
    userAvatarIcon: css`
      height: ${typography.size.md};
    `,
    tableWrapper: css`
      margin-top: ${spacing.lg};
    `,
  });
