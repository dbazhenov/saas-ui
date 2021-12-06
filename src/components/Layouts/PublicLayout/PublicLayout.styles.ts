import { css } from 'emotion';
import { GrafanaTheme } from '@grafana/data';

export const getStyles = (theme: GrafanaTheme) => {
  const { colors, breakpoints, palette, typography } = theme;

  return {
    main: css`
      display: flex;
      min-height: 100vh;
      padding: 2em;
      justify-content: space-between;
      color: ${colors.text};
      background-color: ${colors.dashboardBg};
      @media (max-width: ${breakpoints.md}) {
        flex-direction: column;
        padding: 4em 2em;
        justify-content: flex-start;
      }
    `,
    leftZone: css`
      display: flex;
      flex: 0 0 45%;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 0 2em;
    `,
    logo: css`
      display: flex;
      justify-content: center;
      align-items: center;
      svg {
        width: 220px;
        height: 70px;
        @media (min-width: ${breakpoints.md}) {
          width: 300px;
          height: 80px;
        }
        @media (min-width: ${breakpoints.lg}) {
          width: 470px;
          height: 90px;
        }
      }
    `,
    centerZone: css`
      position: relative;
      flex: 0 1 5%;
      @media (max-width: ${breakpoints.md}) {
        display: none;
      }
      &:after {
        content: '';
        position: absolute;
        top: 30%;
        right: 50%;
        width: 1px;
        height: 50%;
        background-color: ${palette.gray85};
      }
    `,
    description: css`
      color: ${colors.text};
      font-size: ${typography.size.md};
      @media (min-width: ${breakpoints.md}) {
        /* No preset value here */
        font-size: 16px;
        max-width: 350px;
        margin-bottom: 0;
      }
      @media (min-width: ${breakpoints.lg}) {
        /* No preset value here */
        font-size: 16px;
        max-width: 400px;
        margin-bottom: 0;
      }
      @media (max-width: ${breakpoints.sm}) {
        display: none;
      }
      max-width: 350px;
      text-align: center;
    `,
    rightZone: css`
      display: flex;
      flex: 0 1 50%;
      justify-content: center;
      align-items: center;
      padding: 0em 4em;
    `,
  };
};
