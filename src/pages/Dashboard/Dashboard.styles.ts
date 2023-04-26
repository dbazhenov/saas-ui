import { css } from 'emotion';
import { Theme } from '@mui/material';

export const getStyles = ({ spacing, typography }: Theme) => ({
  container: css`
    display: flex;
    flex-direction: column;
    width: 100%;
  `,
  ticketSection: css`
    margin-top: ${spacing(3)};
  `,
  ticketSectionTitle: css`
    font-weight: ${typography.fontWeightMedium} !important;
  `,
  ticketListHeader: css`
    font-weight: ${typography.fontWeightMedium};
    align-items: center;
    display: flex;
    justify-content: space-between;
    margin-bottom: ${spacing(1)};
  `,
  newTicketButton: css`
    text-decoration: none;
  `,
  cardsWrapper: css`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    & :not(:last-child) {
      margin-right: ${spacing(2)};
    }
  `,
  widgets: css`
    display: flex;
    flex-direction: row;
  `,
});
