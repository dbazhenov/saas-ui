import { css } from 'emotion';
import { Theme } from '@mui/material';

export const getStyles = ({ palette, spacing }: Theme) => ({
  container: css`
    align-items: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-top: ${spacing(4)};

    svg {
      color: ${palette.primary.light};
      height: 145px;
      opacity: 45%;
    }
  `,
  form: css`
    align-items: center;
    display: flex;
    flex-direction: column;
  `,
  orgNameInput: css`
    width: 200px;
  `,
  title: css`
    margin: ${spacing(3)} 0 ${spacing(3)} !important;
  `,
  actions: css`
    align-items: center;
    display: flex;
    justify-content: center;
    margin-top: ${spacing(2)};

    & :not(:last-child) {
      margin-right: ${spacing(3)};
    }
  `,
});
