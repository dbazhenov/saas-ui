import { GrafanaTheme } from '@grafana/data';
import { css, keyframes } from 'emotion';

const slide = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

export const getStyles = ({ colors }: GrafanaTheme) => ({
  skeleton: css`
    height: 100%;
    width: 100%;
    background: rgba(0, 0, 0, 0) linear-gradient(110deg, ${colors.bg3}, ${colors.bg1}, ${colors.bg3}) repeat
      scroll 0% 0% / 300% 300%;
    animation: ${slide} 3s ease-in-out infinite;
  `,
});
