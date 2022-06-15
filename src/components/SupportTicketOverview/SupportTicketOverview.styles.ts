import { GrafanaTheme } from '@grafana/data';
import { css } from 'emotion';

export const getStyles = ({ colors, spacing, typography }: GrafanaTheme) => ({
  marginSection: css`
    margin-top: ${spacing.lg};
  `,
  container: css`
    background-color: ${colors.bg1};
  `,
  containerPadding: css`
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: ${spacing.lg};
  `,
  centeredElement: css`
    text-align: center;

    strong {
      font-size: ${typography.heading.h1};
    }

    p {
      margin: 0;
    }
  `,
});
