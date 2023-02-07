import { css } from 'emotion';
import { Theme } from '@mui/material';

export const getStyles = ({ palette, shape, spacing, typography, shadows }: Theme) => ({
  container: css`
    min-height: 100vh;
    height: 100%;
    box-sizing: border-box;
    display: flex;
    justify-content: flex-end;
  `,
  leftSide: css`
    display: flex;
    max-width: 660px;
    flex: 1;
    flex-direction: column;
    background-color: ${palette.common.white};
    padding: ${spacing(10)};
  `,
  logo: css`
    margin: ${spacing(10)} 0 ${spacing(4)} 0;
    height: 133px;
    width: 154px;

    & svg {
      height: 100%;
      width: 100%;
    }
  `,
  texts: css`
    display: flex;
    flex-direction: column;
    padding-right: ${spacing(3)};
    box-sizing: border-box;
    flex: 1;

    a {
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

    h5 {
      margin-bottom: ${spacing(5)};
    }

    li {
      display: flex;
      list-style-type: none;
      margin-bottom: ${spacing(1)};
      font-weight: ${typography.fontWeightRegular};
    }
  `,
  leftLi: css`
    display: flex;
    justify-items: center;
  `,
  bulletPointText: css`
    padding-left: ${spacing(2)};
  `,
  auth: css`
    flex: 1;
    background: #232832;
    border-radius: ${shape.borderRadius};
    display: flex;
    flex-direction: column;

    #okta-sign-in.auth-container {
      border: 0 !important;
      box-shadow: none !important;
      background: none !important;
      margin: 0 !important;
      box-shadow: none;

      .button-primary {
        display: flex;
        background: ${palette.primary.main} !important;
        border: none !important;
        flex: 1;
        border-radius: 40px;
        height: 40px;
        align-items: center;
        justify-content: center;

        &:hover {
          background: none !important;
          background-color: ${palette.primary.light} !important;
        }

        &:active {
          outline: 0 !important;
        }

        &.link-button-disabled {
          background-color: #d5d5d7 !important;
          color: #a9aaab !important;
          opacity: 1;
        }
      }

      .focused-input {
        box-shadow: none !important;
      }

      .registration-container {
        margin: 0;

        .content-container {
          display: flex;
          flex-direction: column;
          padding: ${spacing(2)} 0 ${spacing(2)} 0;
          border: 0;

          .registration-link {
            display: inline-flex;
            text-decoration: none;
            color: ${palette.primary.main};
            font-weight: 600;
          }

          .registration-link:hover {
            text-decoration: underline;
          }
        }
      }

      #tos-wrapper {
        margin-bottom: ${spacing(3)};
      }

      .tos-label {
        font-size: ${typography.caption.fontSize} !important;

        a {
          color: ${palette.primary.main} !important;
        }
      }
    }

    .okta-sign-in-header {
      display: none;
    }

    .okta-form-title {
      font-size: ${typography.h6.fontSize} !important;
      color: ${palette.common.black} !important;
      margin-bottom: ${spacing(3)} !important;
    }

    .auth-footer {
      margin-top: ${spacing(2)} !important;
    }

    .registration-label {
      font-size: ${typography.caption.fontSize} !important;
    }
  `,
  bulletPoint: css`
    color: #7d2897;
  `,
});
