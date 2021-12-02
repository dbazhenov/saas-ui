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
    containerLoading: css`
      height: 242px;
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
    infoWrapper: css`
      align-items: center;
      background-color: ${colors.bg3};
      display: flex;
      height: 60px;
      padding: ${spacing.sm};
      width: fit-content;
      margin-bottom: ${spacing.md};
    `,
    icon: css`
      margin-right: ${spacing.sm};
    `,
  });
};
