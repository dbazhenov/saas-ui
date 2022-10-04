import { css } from 'emotion';
import { GrafanaTheme } from '@grafana/data';
import loginBg from 'assets/login-bg.png';

export const getStyles = (theme: GrafanaTheme) => {
  const { palette, border, spacing, typography } = theme;

  return {
    container: css`
      background-image: url(${loginBg});
      background-size: cover;
      height: 100vh;
      box-sizing: border-box;
      padding: 50px;
      display: flex;
      justify-content: flex-end;
    `,
    leftSide: css`
      display: flex;
      flex: 1;
      flex-direction: column;
    `,
    logo: css`
      display: flex;

      img {
        width: 100%;
        max-width: 350px;
      }
    `,
    texts: css`
      color: ${palette.white};
      display: flex;
      justify-content: center;
      flex-direction: column;
      padding-right: ${spacing.lg};
      box-sizing: border-box;
      max-width: 600px;
      flex: 1;

      a {
        color: ${palette.white};
        text-decoration: none;
        align-items: center;
        line-height: 30px;
        vertical-align: middle;
        display: flex;

        img {
          margin-left: 7px;
          margin-right: ${spacing.lg};
        }
      }

      h2 {
        font-size: 32px;
        font-weight: ${typography.weight.bold};
        margin-bottom: ${spacing.lg};
      }

      h3 {
        font-size: 24px;
        font-weight: ${typography.weight.semibold};
      }

      li {
        display: flex;
        list-style-type: none;
        margin-bottom: ${spacing.lg};
        font-weight: ${typography.weight.regular};
        font-size: 18px;

        strong {
          font-weight: ${typography.weight.bold};
        }

        img {
          margin-right: ${spacing.lg};
        }
      }
    `,
    leftLi: css`
      display: flex;
      justify-items: center;
      align-items: center;
    `,
    auth: css`
      max-width: 600px;
      flex: 1;
      background-color: ${palette.white};
      border-radius: ${border.radius.lg};
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 0 10px;
      flex-direction: column;

      #okta-sign-in.auth-container {
        border: 0 !important;
        box-shadow: none !important;
        background: none !important;
        margin: 0 !important;
        box-shadow: none;

        .button-primary {
          background: ${palette.blue77};
          border-color: ${palette.blue80} !important;

          &:hover {
            background: none !important;
            background-color: ${palette.blue80} !important;
            border-color: ${palette.blue85} !important;
          }

          &.link-button-disabled {
            background-color: ${palette.blue95} !important;
            border-color: ${palette.blue95} !important;
          }
        }

        .registration-container {
          margin: 0;

          .content-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 0 0 ${spacing.xl} 0;
            border: 0;

            .registration-link {
              display: inline-flex;
              text-decoration: none;
              background-color: #fbfbfb;
              color: ${palette.blue77};
              padding: 6px 12px;
              border: ${border.width.sm} solid ${palette.blue95};
              border-radius: ${border.radius.lg};
              margin-top: ${spacing.md};
            }

            .registration-link:hover {
              text-decoration: none;
              background-color: #fff;
            }
          }
        }

        #tos-wrapper {
          margin-bottom: 12px;
        }

        .tos-label {
          font-size: 13px !important;

          a {
            color: #007dc1;
          }
        }
      }

      .okta-sign-in-header {
        display: none;
      }

      .okta-form-title {
        font-size: 20px !important;
        color: ${palette.black} !important;
      }

      .auth-footer {
        margin-top: ${spacing.md} !important;
      }
    `,
    authCenter: css`
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
    `,
  };
};
