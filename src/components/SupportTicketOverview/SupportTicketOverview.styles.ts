import { GrafanaTheme } from '@grafana/data';
import { css } from 'emotion';

export const getStyles = ({ colors, spacing, typography }: GrafanaTheme) => ({
  marginSection: css`
    margin-top: ${spacing.base * 7}px;
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
  headerFont: css`
    font-size: ${typography.heading.h3};
    font-weight: ${typography.weight.semibold};
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
