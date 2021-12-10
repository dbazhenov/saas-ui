import { css } from 'emotion';
import { GrafanaTheme } from '@grafana/data';

export const getStyles = ({ spacing, palette }: GrafanaTheme) => ({
  wrapper: css`
    align-items: center;
    display: flex;
  `,
  label: css`
    width: 110px;
  `,
  timesIcon: css`
    color: ${palette.redBase};
    margin-left: ${spacing.md};
  `,
  checkIcon: css`
    color: ${palette.greenBase};
    margin-left: ${spacing.md};
  `,
});
