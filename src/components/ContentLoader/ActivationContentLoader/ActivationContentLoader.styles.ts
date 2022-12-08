import { css } from 'emotion';
import { GrafanaTheme } from '@grafana/data';

export const getStyles = (theme: GrafanaTheme) => {
  const { palette } = theme;

  return {
    fullscreenWrapper: css`
      display: flex;
      width: 100%;
      height: 100vh;
      justify-content: center;
    `,
    backgroundLoader: palette.gray5,
    colorLoader: palette.white,
    loaderSize: css`
      width: 100%;
      max-width: 1100px;
      height: 100%;
    `,
  };
};
