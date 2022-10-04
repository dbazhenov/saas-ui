import { GrafanaTheme } from '@grafana/data';
import { css } from 'emotion';

export const getStyles = ({ colors, spacing, typography }: GrafanaTheme) => ({
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
    font-size: ${typography.heading.h3};
    font-weight: ${typography.weight.semibold};
  `,
  ticketListHeader: css`
    align-items: center;
    display: flex;
    justify-content: space-between;
  `,
  newTicketButton: css`
    text-decoration: none;
  `,
});
