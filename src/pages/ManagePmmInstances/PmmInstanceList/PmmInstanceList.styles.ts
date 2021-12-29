import { css } from 'emotion';
import { GrafanaTheme } from '@grafana/data';

export const getStyles = ({ spacing }: GrafanaTheme) => ({
  tableWrapper: css`
    padding: ${spacing.sm};
  `,
  instanceServerLink: css`
    text-decoration: none;
    line-height: 1;

    & > * {
      padding: 0;
    }
  `,
});
