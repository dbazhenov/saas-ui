import { css } from 'emotion';
import { Theme } from '@mui/material';

export const getStyles = ({ spacing, palette }: Theme) => ({
  saveButton: css`
    margin-top: ${spacing(2)} !important;
  `,
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
});
