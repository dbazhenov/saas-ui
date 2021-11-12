import { css } from 'emotion';
import { GrafanaTheme } from '@grafana/data';

export const getStyles = (theme: GrafanaTheme) => {
  const { colors, spacing } = theme;

   return ({
    container: css`
      align-items: center;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding-top: ${spacing.lg};

      svg {
        color: ${colors.bgBlue1};
        height: 145px;
        opacity: 45%;
      }
    `,
    orgDetails: css`
      align-items: center;
      display: flex;
      flex-direction: column;
      margin-top: ${spacing.lg};

      & > :not(:first-child) {
        margin-top: ${spacing.md};
      }
    `,
  });
};
