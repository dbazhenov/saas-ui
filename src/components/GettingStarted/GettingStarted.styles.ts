import { css } from 'emotion';
import { Theme } from '@mui/material';

export const getStyles = ({ palette, spacing }: Theme) => ({
  header: css`
    align-items: center;
    display: flex;
    margin: ${spacing(7)} 0 ${spacing(4)} !important;
  `,
  container: css`
    display: flex;
    flex-direction: column;
    justify-content: center;
    line-height: 2em;
    margin-bottom: ${spacing(4)};
    padding: 0 ${spacing(4)};

    > :not(:first-child) {
      margin-top: ${spacing(3)};
    }

    > :not(:last-child) {
      border-bottom: 1px solid ${palette.divider};
      padding-bottom: ${spacing(3)};
    }
  `,
});
