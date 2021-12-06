import { css } from 'emotion';
import { GrafanaTheme } from '@grafana/data';

export const getStyles = ({ spacing }: GrafanaTheme) => ({
  deleteForm: css`
    align-items: center;
    display: flex;
    flex-direction: column;
    padding-top: ${spacing.lg};

    // TODO: fix the label margin in CheckboxField
    label:last-child {
      margin-left: ${spacing.xs};
    }
  `,
  saveButton: css`
    align-self: flex-end;
  `,
});
