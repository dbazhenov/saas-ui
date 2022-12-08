import { css } from 'emotion';
import { Theme } from '@mui/material';

export const getStyles = ({ spacing, palette }: Theme) => ({
  container: css`
    align-items: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-top: ${spacing(4)};

    & > svg {
      color: ${palette.primary.light};
      height: 145px;
      opacity: 45%;
    }
  `,
  containerLoading: css`
    height: 242px;
  `,
  orgDetails: css`
    align-items: center;
    display: flex;
    flex-direction: column;
    margin-top: ${spacing(4)};

    & > :not(:first-child) {
      margin-top: ${spacing(1)};
    }
  `,
  infoWrapper: css`
    align-items: center;
    background-color: ${palette.info.light};
    display: flex;
    height: 60px;
    padding: ${spacing(1)};
    width: fit-content;
  `,
  icon: css`
    margin-right: ${spacing(1)};
  `,
  actions: css`
    & > * {
      color: ${palette.primary.light};
      cursor: pointer;

      &:not(:last-child) {
        margin-right: ${spacing(0)};
      }

      &:hover {
        color: ${palette.primary.light};
        opacity: 75%;
      }
    }
  `,
});
