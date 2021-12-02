import { GrafanaTheme } from '@grafana/data';
import { css } from 'emotion';

export const getStyles = ({ colors }: GrafanaTheme) => ({
  header: css`
    cursor: default;
  `,
  row: css`
    cursor: pointer;

    &:hover {
      td {
        background-color: ${colors.bg2};
      }
    }
  `,
});
