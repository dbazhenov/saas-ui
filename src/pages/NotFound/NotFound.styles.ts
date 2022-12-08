import { css } from 'emotion';
import { Theme } from '@mui/material';

export const getStyles = ({ spacing, palette }: Theme) => ({
  contentWrapper: css`
    display: flex;
    flex-direction: column;
    justify-content: center;
    background-color: ${palette.background.default};
    min-height: 100vh;
    align-items: center;
    padding: 2em;
  `,
  link: css`
    color: inherit;
    text-decoration: none;
    margin-top: ${spacing(1)};
  `,
  homeButton: css`
    width: 180px;
    padding: 0;
    justify-content: center;
    text-transform: capitalize !important;
  `,
  logo: css`
    width: 100%;
    min-width: 250px;
    max-width: 600px;
  `,
});
