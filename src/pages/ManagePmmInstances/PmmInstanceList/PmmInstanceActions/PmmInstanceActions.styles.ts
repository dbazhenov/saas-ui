import { css } from 'emotion';
import { GrafanaTheme } from '@grafana/data';

export const getStyles = ({ colors, spacing }: GrafanaTheme) => ({
  actionButton: css`
    color: ${colors.text};
    cursor: pointer;

    &:not(:first-child) {
      margin-left: ${spacing.sm};
    }
  `,
  actionsWrapper: css`
    display: flex;
    align-content: center;
    justify-content: center;
  `,
});
