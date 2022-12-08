import { css } from 'emotion';
import { Theme } from '@mui/material';

export const getStyles = ({ spacing, palette }: Theme) => ({
  container: css`
    display: flex;
    flex-direction: column;
    padding-top: ${spacing(2)};
  `,
  inviteButton: css`
    align-self: flex-end;
  `,
  inviteForm: css`
    display: flex;
    flex-direction: column;
  `,
  addRowLink: css`
    margin-top: ${spacing(0)};
    align-self: flex-end;
  `,
  saveButton: css`
    margin-top: ${spacing(4)};
    align-self: flex-end;
    text-decoration: none;
  `,
  rowContainer: css`
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
  `,
  emailField: css`
    flex: 1;
    margin-right: ${spacing(2)} !important;
  `,
  iconButton: css`
    align-self: flex-end;
  `,
  iconButtonContainer: css`
    padding-left: ${spacing(2)};
    padding-top: ${spacing(1)};
  `,
  footerContainer: css`
    display: flex;
    justify-content: space-between;
  `,
  footerMessage: css`
    vertical-align: bottom;
    margin-top: ${spacing(5)};
    font-weight: bold;
    color: ${palette.grey[500]};
  `,
  rowWrapper: css`
    display: flex;
    align-items: flex-start;
    flex: 1;
    padding: ${spacing(1)};

    &:last-child {
      margin-bottom: ${spacing(1)};
    }
  `,
  buttonsWrapper: css`
    display: inline-flex;
  `,
});
