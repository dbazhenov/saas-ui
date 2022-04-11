import { css } from 'emotion';
import { GrafanaTheme } from '@grafana/data';

export const getStyles = (theme: GrafanaTheme) => {
  const { border, colors, spacing, isLight, typography } = theme;

  const link = css`
    &:hover,
    &:active {
      background-color: ${isLight ? colors.bg3 : colors.bg1};
    }
  `;

  const menuBorderColor = isLight ? colors.border1 : colors.border2;

  return {
    menuBar: css`
      background-color: ${colors.pageHeaderBg};
      border-bottom: ${border.width.sm} solid ${colors.border1};
      display: flex;
      height: 60px;

      nav {
        height: 100%;

        ul {
          align-items: center;
          display: flex;
          height: 100%;
          list-style-type: none;
          margin: 0;
          padding: 0;

          li {
            height: 100%;
            min-width: 60px;
            position: relative;

            & > * {
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100%;
            }
          }
        }
      }
    `,
    logo: css`
      padding: 0 ${spacing.md};
      text-decoration: none;
      color: ${colors.text};
      font-weight: ${typography.weight.regular};

      img {
        margin-right: 15px;
      }
    `,
    leftSide: css`
      flex: 1;
    `,
    rightSide: css`
      color: ${colors.text};
      li::before {
        content: '';
        border-left: ${border.width.sm} solid ${menuBorderColor};
        height: 100%;
        position: absolute;
        top: 0;
      }
    `,
    perconaLogo: css`
      height: 33px;
    `,
    profileIcon: css`
      height: 23px;
    `,
    menuIcon: css`
      ${link}
      align-items: center;
      cursor: pointer;
      display: flex;
      height: 100%;
      justify-content: center;
      width: 100%;
    `,
    link: css`
      ${link}
    `,
  };
};
