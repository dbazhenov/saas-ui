import { css } from 'emotion';
import { Theme } from '@mui/material';
import { greyBorder } from './KuberconfigModal.constants';

export const getStyles = ({ spacing }: Theme) => ({
  // XXX: temporary workaround to fix Modal's dark theme
  textArea: css`
    height: 400px;
    resize: none;
    margin-bottom: ${spacing(3)};
  `,
  copyClipboardBtn: css`
    text-transform: capitalize !important;
  `,
  dialogTitle: css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 0.5px solid ${greyBorder};
    padding-top: ${spacing(0.55)} !important;
    padding-bottom: ${spacing(0.55)} !important;
  `,
  dialogTitleText: css`
    font-size: ${spacing(2)};
  `,
  closeIcon: css`
    font-size: ${spacing(2)};
  `,
  dialogActions: css`
    padding: ${spacing(3)} !important;
  `,
  dialogContent: css`
    padding-bottom: ${spacing(0.25)} !important;
    margin-top: ${spacing(2)};
  `,
});
