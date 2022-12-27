import { css } from 'emotion';
import { GrafanaTheme } from '@grafana/data';

export const getStyles = (theme: GrafanaTheme) => {
  const { palette } = theme;

  return {
    backgroundLoader: palette.gray5,
    colorLoader: palette.white,
    loaderSize: css`
      width: 100%;
      height: 100%;
    `,
  };
};
