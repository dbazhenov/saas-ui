import { css } from 'emotion';

export const getStyles = () => ({
  advisorsWrapper: css`
    display: flex;
    flex-direction: column;
    width: 100%;
  `,
  pageWrapper: css`
    width: 100%;
  `,
  tabRoot: css`
    text-transform: none !important;
  `,
  loader: css`
    display: flex;
    justify-content: center;
  `,
  tabs: css`
    flex-grow: 1;
  `,
  tabsWrapper: css`
    display: flex;
    justify-content: space-between;
  `,
});
