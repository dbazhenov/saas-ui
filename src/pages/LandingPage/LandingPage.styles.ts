import { css } from 'emotion';
import { Theme } from '@mui/material';
import { TABLET_BREAKPOINT, MOBILE_BREAKPOINT } from 'core/constants';

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
    justify-content: center;
    padding: ${spacing(4)} ${spacing(4)} ${spacing(6)} ${spacing(4)};
    flex: 1;
    color: white;
    width: 100%;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.25);

    @media (max-width: ${TABLET_BREAKPOINT}) {
      padding: ${spacing(4)} ${spacing(3)} ${spacing(5)} ${spacing(3)};
    }
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
    width: 100%;
    margin-top: ${spacing(5)} !important;
  `,
  loginButton: css`
    color: ${palette.common.black};
  `,
  loginButtonWrapper: css`
    padding-left: ${spacing(3)} !important;

    @media (max-width: ${TABLET_BREAKPOINT}) {
      padding-left: ${spacing(1)} !important;
    }
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

    @media (max-width: ${TABLET_BREAKPOINT}) {
      display: none;
    }
  `,
  mainContent: css`
    ${content};
    flex: 1;
    padding: ${spacing(6)} 0;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;

    @media (max-width: ${TABLET_BREAKPOINT}) {
      justify-content: center;
      padding: ${spacing(6)} ${spacing(2)};
    }

    @media (max-width: ${MOBILE_BREAKPOINT}) {
      padding: ${spacing(6)} ${spacing(1)};
    }
  `,
  mainSectionTitle: css`
    width: 100%;
    padding-left: ${spacing(2)};
  `,
  cards: css`
    width: 100%;
    display: flex;
    margin-top: ${spacing(4)} !important;
    justify-content: space-between;
  `,
  cardWrapper: css`
    display: flex;
    justify-content: center;
  `,
  mainSectionCtaWrapper: css`
    width: 100%;
    text-align: center;
    justify-content: center;
    margin-top: ${spacing(6)} !important;
  `,
  demo: css`
    width: 100%;
    display: flex;
    margin-top: ${spacing(7)} !important;
    align-items: center;
    justify-content: space-between;
  `,
  demoTitle: css`
    max-width: ${spacing(40)};
  `,
  demoCta: css`
    margin-top: ${spacing(3)} !important;

    @media (max-width: ${TABLET_BREAKPOINT}) {
      align-self: center;
    }
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

    @media (max-width: ${TABLET_BREAKPOINT}) {
      margin: 0;
      width: 100%;
    }
  `,
  footer: css`
    width: 100%;
    border-top: 1px solid ${palette.divider};
    min-height: ${spacing(6)};
    padding: 0 ${spacing(2)};
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

      @media (max-width: ${TABLET_BREAKPOINT}) {
        padding: 0 ${spacing(0.5)};
      }
    }
  `,
  footerContent: css`
    ${content};
    display: flex;
    justify-content: flex-end;
  `,
});
