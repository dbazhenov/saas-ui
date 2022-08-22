import { css } from 'emotion';
import { GrafanaTheme } from '@grafana/data';

export const getStyles = ({ colors }: GrafanaTheme) => ({
  link: css`
    color: ${colors.linkExternal};
    text-decoration: none;
    cursor: pointer;
  `,
  paragraphWrapper: css`
    margin: 0;
  `,
});
