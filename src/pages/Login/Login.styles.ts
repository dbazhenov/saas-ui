import { css } from 'emotion';
import { GrafanaTheme } from '@grafana/data';

const button = css`
  width: 100%;
  display: block;
  margin: 2em 0;
`;

export const getStyles = (theme: GrafanaTheme) => {
  const { colors, spacing, typography } = theme;

  return {
    legend: css`
      font-size: ${typography.heading.h3};
      font-weight: ${typography.weight.regular};
      margin: ${spacing.formMargin};
      text-align: center;
    `,
    link: css`
      font-size: 1em;
      height: 1em;
      padding: 0;
      vertical-align: baseline;
    `,
    container: css`
      max-width: 325px;
      min-width: 250px;
      width: 100%;
    `,
    loginButton: css`
      ${button}
      display: flex;
      justify-content: center;
      margin-bottom: ${spacing.formInputMargin};
    `,
    gotoButton: css`
      ${button}
      color: ${colors.linkExternal};
      text-align: center;
      text-decoration: none;
      &:hover {
        text-decoration: underline;
      }
    `,
  };
};
