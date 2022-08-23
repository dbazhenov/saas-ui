import { css } from 'emotion';
import { GrafanaTheme } from '@grafana/data';

export const getStyles = ({ spacing, colors }: GrafanaTheme) => ({
  // XXX: temporary workaround to fix Modal's dark theme
  modalWrapper: css`
    color: ${colors.text};
  `,
  textArea: css`
    height: 400px;
    resize: none;
    margin-bottom: ${spacing.md};
  `,
});
