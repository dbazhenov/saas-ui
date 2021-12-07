import { GrafanaTheme } from '@grafana/data';
import { css } from 'emotion';

export const getStyles = ({ colors, spacing }: GrafanaTheme) => ({
  container: css`
    display: flex;
    flex-direction: column;
    color: ${colors.text};
    width: 100%;
  `,
  ticketSection: css`
    margin-top: ${spacing.lg};
  `,
  ticketSectionTitle: css`
    color: ${colors.textSemiWeak};
  `,
});
