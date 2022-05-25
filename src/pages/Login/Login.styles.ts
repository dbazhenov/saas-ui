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
          background: #4c15a5;
          border-color: #3c1084 !important;

          &:hover {
            background: none !important;
            background-color: #5d2cae !important;
            border-color: #6f43b7 !important;
          }

          &.link-button-disabled {
            background-color: #a58ad2 !important;
            border-color: #9372c9 !important;
          }
        }

        .tos-label a {
          color: #007dc1;
        }
      }

      .primary-auth-container .tos-label {
        font-size: 13px !important;
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
