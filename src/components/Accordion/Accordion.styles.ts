import { GrafanaTheme } from '@grafana/data';
import { css } from 'emotion';

export const getStyles = ({ colors, spacing, typography }: GrafanaTheme) => ({
  container: css`
    background-color: ${colors.bg1};
    box-shadow: 0 4px 4px ${colors.bg3};
    margin-bottom: ${spacing.lg};
    padding: 0 ${spacing.lg} 0 ${spacing.lg};
    background-color: ${colors.bg1};
  `,
  header: css`
    display: flex;
    align-items: center;
    padding: ${spacing.lg} 0 0 0;
    color: ${colors.textHeading};
  `,
  title: css`
    display: inline-block;
    font-size: 26px;
    font-weight: ${typography.weight.semibold};
    margin: 0;
  `,
  content: css`
    padding-bottom: ${spacing.lg};
    margin-top: ${spacing.lg};
  `,
  description: css`
    padding: ${spacing.md} 0 ${spacing.lg} 0;
    border-top: 1px solid ${colors.border1};
    color: ${colors.textHeading};
  `,
});
