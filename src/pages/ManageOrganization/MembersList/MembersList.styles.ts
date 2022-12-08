import { css } from 'emotion';
import { Theme } from '@mui/material';

export const getStyles = ({ spacing }: Theme) => ({
  fullNameWrapper: css`
    display: flex;
    align-items: center;
  `,
  fullName: css`
    margin-left: ${spacing(1)};
  `,
  labelsResendEmails: css`
    margin-left: ${spacing(1)};
  `,
  clockIconWrapper: css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    line-height: ${spacing(3)};
  `,
  clockIcon: css`
    height: ${spacing(2)};
  `,
  userAvatarIcon: css`
    height: ${spacing(2)};
  `,
  tableWrapper: css`
    margin-top: ${spacing(3)};
  `,
});
