import { css } from 'emotion';
import { Theme } from '@mui/material';

export const getStyles = ({ spacing }: Theme) => ({
  editForm: css`
    margin-top: 15px;
    & > :not(:last-child) {
      margin-right: ${spacing(1)} !important;
    }
  `,
  select: css`
    min-width: 120px !important;
  `,
});
