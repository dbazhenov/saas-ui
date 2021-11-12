import { css } from 'emotion';
import { GrafanaTheme } from '@grafana/data';

export const getStyles = (theme: GrafanaTheme) => {
  const { colors, spacing, typography } = theme;

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
    form: css`
      align-items: center;
      display: flex;
      flex-direction: column;
    `,
    orgNameInput: css`
      width: 200px;
    `,
    title: css`
      font-size: ${typography.heading.h4};
      margin: ${spacing.md} 0 ${spacing.lg};
    `,
  });
};
