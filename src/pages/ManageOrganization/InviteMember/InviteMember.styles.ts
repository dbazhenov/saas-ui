import { css } from 'emotion';
import { GrafanaTheme } from '@grafana/data';

export const getStyles = (theme: GrafanaTheme) => {
  const { spacing, typography } = theme;

   return ({
    container: css`
      display: flex;
      flex-direction: column;
      padding-top: ${spacing.md}
    `,
    inviteButton: css`
      align-self: flex-end;
    `,
    inviteForm: css`
      display: flex;
      flex-direction: column;
    `,
    roleSelect: css`
      // style for Grafana's select
      // TODO: remove this after a select component is added to core-ui
      > div {
        padding-top: 7px;
        padding-bottom: 7px;
        font-size: ${typography.size.md};
      }
    `,
    roleSelectLabel: css`
      font-size: ${typography.size.base};
    `,
    saveButton: css`
      margin-top: ${spacing.xl};
      align-self: flex-end;
    `,
  });
};
