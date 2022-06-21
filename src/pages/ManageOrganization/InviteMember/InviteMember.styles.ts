import { css } from 'emotion';
import { GrafanaTheme } from '@grafana/data';

export const getStyles = (theme: GrafanaTheme) => {
  const { spacing, typography, colors } = theme;

  return {
    container: css`
      display: flex;
      flex-direction: column;
      padding-top: ${spacing.md};
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
        margin-left: ${spacing.xs};
      }
    `,
    roleSelectLabel: css`
      font-size: ${typography.size.base};
    `,
    addRowLink: css`
      margin-top: ${spacing.xs};
      align-self: flex-end;
    `,
    saveButton: css`
      margin-top: ${spacing.xl};
      align-self: flex-end;
      text-decoration: none;
    `,
    rowContainer: css`
      display: flex;
      flex-wrap: wrap;
    `,
    rowEmailHeader: css`
      flex: 1 1 50%;
    `,
    rowRoleHeader: css`
      flex: 1 1 50%;
    `,
    rowEmail: css`
      margin-top: 5px;
      display: block;
      flex: 1 1 50%;
    `,
    rowRole: css`
      margin-top: 5px;
      display: flex;
      flex: 1 1 50%;
      height: 35px;
    `,
    emailField: css`
      display: block;
      width: 95%;
    `,
    iconButton: css`
      align-self: flex-end;
    `,
    iconButtonContainer: css`
      padding-left: ${spacing.md};
    `,
    footerContainer: css`
      display: flex;
      justify-content: space-between;
    `,
    footerMessage: css`
      vertical-align: bottom;
      margin-top: 40px;
      font-weight: bold;
      color: ${colors.textWeak};
    `,
  };
};
