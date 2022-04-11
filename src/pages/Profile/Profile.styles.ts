import { css } from 'emotion';
import { GrafanaTheme } from '@grafana/data';

export const getStyles = (theme: GrafanaTheme) => {
  const { colors, spacing, typography } = theme;

   return {
    wrapper: css`
      display: flex;
      justify-content: center;
      width: 100%;
    `,
    form: css`
      flex: 1;
      max-width: 600px;
    `,
    legend: css`
      font-size: ${typography.heading.h3};
      font-weight: ${typography.weight.regular};
      margin: ${spacing.formMargin};
      text-align: center;
      color: ${colors.text};
    `,
    nameFields: css`
      display: flex;

      & > * {
        flex: 1;
        justify-content: space-between;

        &:not(:last-child) {
          margin-right: ${spacing.md};
        }
      }
    `,
    buttonWrapper: css`
      display: flex;
      justify-content: flex-end;
      margin-top: ${spacing.md};
    `,
    editProfileWrapper: css`
      margin-top: ${spacing.md};
    `,
    externalLink: css`
      color: ${colors.linkExternal};
      font-weight: ${typography.weight.semibold};
      text-decoration: none;
    `,
    platformAccessTokenWrapper: css`
      display: flex;
      align-items: center;
      justify-content: space-between;
    `,
    platformAccessTokenFieldWrapper: css`
      flex: 1;
      > * {
        // removes the margin-bottom from the last text field
        // TODO: fix that in TextInputField (and the other input fields) - consider using field groups
        margin-bottom: 0 !important;
      }
    `,
    platformAccessTokenButtonWrapper: css`
      > * {
        // overrides the default padding for LinkButton
        padding: 0 0 0 ${spacing.md};
      }
    `,
  };
};
