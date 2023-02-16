import { css } from 'emotion';
import { Theme } from '@mui/material';

const content = css`
  width: 100%;
  max-width: 1110px;
`;

export const getStyles = ({ spacing, palette }: Theme) => ({
  container: css`
    background-color: white;
    width: 100%;
    height: 100vh;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
  `,
  header: css`
    display: flex;
    background: #2c323e;
    max-height: 428px;
    min-height: 428px;
    justify-content: center;
    padding: ${spacing(4)};
    flex: 1;
    color: white;
    width: 100%;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.25);
  `,
  headerContent: css`
    ${content};
    display: flex;
  `,
  headerLeft: css`
    display: flex;
    flex-direction: column;
    flex: 1;
    align-items: flex-start;
  `,
  title: css`
    margin-bottom: ${spacing(2)} !important;
  `,
  ctas: css`
    margin-top: ${spacing(5)};

    & :not(:last-child) {
      margin-right: ${spacing(3)};
    }
  `,
  loginButton: css`
    color: ${palette.common.black};
  `,
  platformLogo: css`
    height: 28px;
    margin-bottom: ${spacing(12.5)};
  `,
  portalLogo: css`
    height: 100%;
    align-self: flex-end;
    margin-left: ${spacing(4)};
    padding: ${spacing(1)};
  `,
  mainContent: css`
    ${content};
    flex: 1;
    padding: ${spacing(6)} 0;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  `,
  cards: css`
    display: flex;
    margin-top: ${spacing(4)};
    justify-content: space-between;
  `,
  mainSectionCtaWrapper: css`
    width: 100%;
    text-align: center;
    margin-top: ${spacing(4)};
  `,
  demo: css`
    display: flex;
    margin-top: ${spacing(7)};
    align-items: center;
    justify-content: space-between;
  `,
  demoTitle: css`
    max-width: ${spacing(40)};
  `,
  demoCta: css`
    margin-top: ${spacing(3)} !important;
  `,
  demoDescriptionWrapper: css`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    max-width: ${spacing(68)};
  `,
  perconaAccountInfo: css`
    margin: 0 ${spacing(3)};
    max-width: ${spacing(52)};
    align-self: flex-end;
  `,
  footer: css`
    width: 100%;
    border-top: 1px solid ${palette.divider};
    min-height: ${spacing(6)};
    padding-right: ${spacing(2)};
    justify-content: center;
    align-items: center;
    display: flex;
    color: ${palette.text.secondary};

    li {
      display: inline;
    }

    & li + li:before {
      content: '|';
      padding: 0 ${spacing(2)};
    }
  `,
  footerContent: css`
    ${content};
    display: flex;
    justify-content: flex-end;
  `,
});
