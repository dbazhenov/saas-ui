import { css } from 'emotion';
import { GrafanaTheme } from '@grafana/data';

export const getStyles = ({ colors }: GrafanaTheme) => ({
  wrapper: css`
    position: relative;
  `,
  centeredElement: css`
    position: absolute;
    display: flex;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    justify-content: center;
    align-items: center;
  `,
  path: css`
    stroke: ${colors.bg1};
  `,
});
