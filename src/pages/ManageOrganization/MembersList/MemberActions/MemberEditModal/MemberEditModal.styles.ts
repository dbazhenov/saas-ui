import { css } from 'emotion';
import { GrafanaTheme } from '@grafana/data';

export const getStyles = ({ typography, spacing }: GrafanaTheme) => ({
  roleSelect: css`
    // style for Grafana's select
    // TODO: remove this after a select component is added to core-ui
    > div {
      padding-top: 7px;
      padding-bottom: 7px;
      font-size: ${typography.size.md};
    }
  `,
  editForm: css`
    display: flex;
    flex-direction: column;
  `,
  inputLabel: css`
    label {
      font-size: ${typography.size.base};
    }
  `,
  selectLabel: css`
    font-size: ${typography.size.base};
  `,
  buttonGroup: css`
    display: flex;
    justify-content: end;
  `,
  actionButton: css`
    min-width: 120px;
    margin-top: ${spacing.xl};
    justify-content: center;
    &:not(:last-child) {
      margin-right: 1em;
    }
  `,
});
