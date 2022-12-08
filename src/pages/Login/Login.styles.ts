import { css } from 'emotion';
import { Theme } from '@mui/material';
import loginBg from 'assets/login-bg.png';

export const getStyles = ({ palette, shape, spacing, typography }: Theme) => ({
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
    color: ${palette.common.white};
    display: flex;
    justify-content: center;
    flex-direction: column;
    padding-right: ${spacing(3)};
    box-sizing: border-box;
    max-width: 600px;
    flex: 1;

    a {
      color: ${palette.common.white};
      text-decoration: none;
      align-items: center;
      line-height: 30px;
      vertical-align: middle;
      display: flex;

      img {
        margin-left: 7px;
        margin-right: ${spacing(3)};
      }
    }

    h2 {
      font-size: 32px;
      font-weight: ${typography.fontWeightBold};
      margin-bottom: ${spacing(5)};
    }

    h3 {
      font-size: 24px;
      font-weight: ${typography.fontWeightMedium};
      margin-bottom: ${spacing(3)};
    }

    li {
      display: flex;
      list-style-type: none;
      margin-bottom: ${spacing(3)};
      font-weight: ${typography.fontWeightRegular};
      font-size: 18px;

      strong {
        font-weight: ${typography.fontWeightBold};
      }

      img {
        margin-right: ${spacing(3)};
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
    background-color: ${palette.common.white};
    border-radius: ${shape.borderRadius};
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
        background: ${palette.primary.main};
        border-color: ${palette.primary.main} !important;

        &:hover {
          background: none !important;
          background-color: ${palette.primary.light} !important;
          border-color: ${palette.primary.light} !important;
        }

        &.link-button-disabled {
          opacity: ${palette.action.disabledOpacity};
        }
      }

      .registration-container {
        margin: 0;

        .content-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0 0 ${spacing(4)} 0;
          border: 0;

          .registration-link {
            display: inline-flex;
            text-decoration: none;
            background-color: #fbfbfb;
            color: ${palette.primary.main};
            padding: 6px 12px;
            border: 1px solid ${palette.primary.main};
            border-radius: ${shape.borderRadius};
            margin-top: ${spacing(2)};
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
      color: ${palette.common.black} !important;
    }

    .auth-footer {
      margin-top: ${spacing(2)} !important;
    }
  `,
  authCenter: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
  `,
});
