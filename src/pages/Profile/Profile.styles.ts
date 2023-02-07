import { css } from 'emotion';
import { Theme } from '@mui/material';

export const getStyles = ({ spacing, typography, shape }: Theme) => ({
  wrapper: css`
    margin: 0 auto;
  `,
  card: css`
    padding-right: ${spacing(4)};
    width: ${spacing(90)};
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: ${spacing(3)};
  `,
  cardContent: css`
    padding: ${spacing(3)} 0 ${spacing(1)} ${spacing(4)};

    > :not(:first-child) {
      margin-top: 0;
      margin-bottom: 0;
    }

    > :last-child {
      margin-bottom: ${spacing(2)};
    }

    > :first-child {
      margin-bottom: ${spacing(2)};
    }
  `,
});
