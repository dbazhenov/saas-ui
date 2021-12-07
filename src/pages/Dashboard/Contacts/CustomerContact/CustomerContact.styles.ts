import { css } from 'emotion';
import { GrafanaTheme } from '@grafana/data';

export const getStyles = ({ spacing, colors, palette, typography }: GrafanaTheme) => ({
  wrapper: css`
    display: flex;
    flex-direction: column;
  `,
  nameWrapper: css`
    align-items: center;
    display: flex;
    margin-bottom: ${spacing.sm};
  `,
  title: css`
    color: ${colors.textSemiWeak};
    font-weight: ${typography.weight.bold};
    margin-bottom: ${spacing.sm};
  `,
  name: css`
    color: ${colors.textSemiWeak};
    margin-left: ${spacing.xs};
    margin-right: ${spacing.md};
  `,
  icon: css`
    cursor: pointer;
    margin-right: ${spacing.md};

    svg {
      color: ${palette.blue80};
    }
  `,
});
