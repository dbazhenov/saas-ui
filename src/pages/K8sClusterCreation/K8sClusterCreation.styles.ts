import { css } from 'emotion';
import { Theme } from '@mui/material';

export const getStyles = ({ spacing, typography }: Theme) => ({
  pageWrapper: css`
    width: 100%;

    header {
      align-items: center;
      display: flex;
      font-size: ${typography.fontSize + 10}px;
      font-weight: ${typography.fontWeightRegular};
      margin: 0 0 ${spacing(2)};

      svg {
        height: ${spacing(3.5)};
        margin-right: ${spacing(2)};
      }
    }
  `,

  contentWrapper: css`
    align-items: center;
    display: flex;
    flex-direction: column;
    margin-top: ${spacing(6)};
    margin: 0 auto;
    max-width: 500px;

    > ul,
    > p,
    > section {
      width: 100%;
    }

    p {
      line-height: 1.5;
    }

    ul {
      list-style-position: inside;
    }
  `,
  description: css`
    font-size: ${typography.fontSize + 4}px;
  `,
  details: css`
    font-size: ${typography.fontSize};
  `,
  loadingMessage: css`
    font-size: ${typography.fontSize + 4}px;
  `,
  getConfigLink: css`
    margin: ${spacing(3)} 0;
    font-size: ${typography.fontSize + 4}px !important;
    text-transform: capitalize !important;
  `,
  createClusterButton: css`
    margin: ${spacing(4)} 0 !important;
    text-transform: capitalize !important;
  `,
  learnMore: css`
    font-size: ${typography.fontSize + 4}px;
    margin-bottom: ${spacing(1)};
  `,
  learnMoreLink: css`
    vertical-align: baseline;
    padding: 0;
  `,
  learnMoreLinks: css`
    margin-bottom: ${spacing(3)};
  `,
  specsWrapper: css`
    font-size: ${typography.fontSize};

    header {
      font-size: ${typography.fontSize + 4}px;
    }

    li {
      list-style-type: none;

      svg {
        height: ${spacing(3)};
      }
    }
  `,
  loader: css`
    margin: ${spacing(6)};
  `,
});
