import { css } from 'emotion';
import { GrafanaTheme } from '@grafana/data';

export const getStyles = ({ typography, spacing }: GrafanaTheme) => ({
  wrapper: css`
    padding-left: ${spacing.xl};
    span {
      font-weight: ${typography.weight.bold};
      margin-right: ${spacing.xs};
    }

    p {
      margin: 0;
      margin-bottom: ${spacing.xs};

      &:nth-child(2) {
        margin-bottom: ${spacing.md};
      }
    }
  `,
  advisorsWrapper: css`
    margin-left: ${spacing.md};
  `,
});
