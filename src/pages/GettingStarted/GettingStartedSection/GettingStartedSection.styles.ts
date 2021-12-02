import { css } from 'emotion';
import { GrafanaTheme } from '@grafana/data';

export const getStyles = (theme: GrafanaTheme) => {
  const { colors, height, spacing, typography } = theme;

  const headerImageSize = `${height.lg}px`;

  return {
    description: css`
      flex: 1;
      margin-right: ${spacing.lg};
    `,
    descriptionWrapper: css`
      align-items: center;
      display: flex;
      margin-left: calc(${spacing.lg} + ${headerImageSize});
    `,
    header: css`
      align-items: center;
      display: flex;
      font-size: ${typography.heading.h2};

      > h2 {
        margin: ${spacing.md} 0;
      }

      > img {
        height: ${headerImageSize};
        margin-right: ${spacing.lg};
        transition: 500ms;
      }
    `,
    link: css`
      align-items: center;
      display: flex;
      flex-direction: column;
      text-decoration: none;
      width: 200px;
    `,
    section: css`
      color: ${colors.text};
      max-width: 900px;
      width: 100%;
    `,
    loadingMessage: css`
      align-items: center;
      color: ${colors.linkExternal};
      display: flex;
      font-weight: ${typography.weight.semibold};
      justify-content: center;
      margin-bottom: ${spacing.xs};
      width: 200px;
    `,
    tickImage: css`
      position: absolute;
      opacity: 0;
    `,
    showTick: css`
      opacity: 1;
    `,
    hideTickBg: css`
      opacity: 0;
    `,
  };
};
