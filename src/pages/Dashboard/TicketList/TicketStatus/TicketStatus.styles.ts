import { GrafanaTheme } from '@grafana/data';
import { stylesFactory } from '@grafana/ui';
import { css } from 'emotion';
import { OrgTicketStatus } from 'core/api/types';
import { getColor } from './TicketStatus.utils';

export const getStyles = stylesFactory((theme: GrafanaTheme, status: OrgTicketStatus) => ({
  status: css`
    color: ${getColor(theme, status)};
    font-weight: ${theme.typography.weight.bold};
  `,
}));
