import { Theme } from '@mui/material';
import { css } from 'emotion';
import { stylesFactory } from 'core';
import { OrgTicketStatus } from 'core/api/types';
import { getColor } from './TicketStatus.utils';

export const getStyles = stylesFactory((theme: Theme, status: OrgTicketStatus) => ({
  status: css`
    color: ${getColor(theme, status)};
    font-weight: ${theme.typography.fontWeightBold};
  `,
}));
