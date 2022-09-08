import { css } from 'emotion';
import { GrafanaTheme } from '@grafana/data';

export const getStyles = ({ spacing, colors, palette, typography }: GrafanaTheme) => ({
  deleteForm: css`
    display: flex;
    flex-direction: column;
    padding-top: ${spacing.md};

    // TODO: fix the label margin in CheckboxField
    label:last-child {
      margin-left: ${spacing.xs};
    }
  `,
  deleteMessage: css`
    margin-bottom: 0;
    font-weight: ${typography.weight.bold};
    line-height: ${typography.lineHeight.md};
  `,
  confirmMessage: css`
    margin-bottom: 0;
    font-weight: ${typography.weight.bold};
  `,
  marginButtons: css`
    margin-top: ${spacing.xs};
  `,
  formMargin: css`
    margin: ${spacing.base * 4}px ${spacing.base * 7}px 0px;
  `,
  inputMargin: css`
    margin-bottom: ${spacing.base * 10}px;
  `,
  deleteMessageWarning: css`
    font-weight: ${typography.weight.bold};
  `,
  extraPaddingForModal: css`
    padding: ${spacing.base * 4}px ${spacing.base * 6}px;
  `,
  disabledColorButton: css`
    color: ${colors.textSemiWeak};
  `,
  activeColorButton: css`
    color: ${palette.white};
  `,
  inputOrg: css`
    width: 50%;
  `,
  alertBackground: css`
    background-color: ${palette.orange};
    padding: ${spacing.base * 2}px ${spacing.base * 2 + 4}px;
    display: flex;
    align-items: center;
    color: ${palette.white};
    font-weight: ${typography.weight.bold};
  `,
  saveButton: css`
    align-self: flex-end;
  `,
});
