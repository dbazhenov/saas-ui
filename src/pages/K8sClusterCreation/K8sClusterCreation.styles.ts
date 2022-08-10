import { GrafanaTheme } from '@grafana/data';
import { css } from 'emotion';

export const getStyles = ({ typography, spacing, colors }: GrafanaTheme) => ({
  pageWrapper: css`
    width: 100%;
    color: ${colors.text};

    header {
      align-items: center;
      display: flex;
      font-size: ${typography.heading.h2};
      font-weight: ${typography.weight.regular};
      margin: 0 0 ${spacing.md};

      svg {
        height: 28px;
        margin-right: ${spacing.md};
      }
    }
  `,
  contentWrapper: css`
    align-items: center;
    display: flex;
    flex-direction: column;
    margin-top: 50px;
    margin: 0 auto;
    max-width: 500px;

    > ul,
    > p,
    > section {
      width: 100%;
    }

    p {
      line-height: ${typography.lineHeight.md};
    }

    ul {
      list-style-position: inside;
    }
  `,
  description: css`
    font-size: ${typography.size.lg};
  `,
  details: css`
    font-size: ${typography.size.md};
  `,
  loadingMessage: css`
    font-size: ${typography.size.lg};
  `,
  getConfigLink: css`
    margin: ${spacing.lg} 0;
    font-size: ${typography.size.lg};
  `,
  createClusterButton: css`
    margin: ${spacing.md} 0;
  `,
  learnMore: css`
    font-size: ${typography.size.lg};
    margin-bottom: ${spacing.sm};
  `,
  learnMoreLink: css`
    vertical-align: baseline;
    padding: 0;
  `,
  learnMoreLinks: css`
    margin-bottom: ${spacing.lg};
  `,
  specsWrapper: css`
    font-size: ${typography.size.md};

    header {
      font-size: ${typography.size.lg};
    }

    li {
      list-style-type: none;

      svg {
        height: 24px;
      }
    }
  `,
});
