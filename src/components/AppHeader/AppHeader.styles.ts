import { SIDE_MENU_WIDTH } from 'components/Layouts/PrivateLayout/PrivateLayout.constants';
import { css } from 'emotion';
import { Theme } from '@mui/material';

export const getStyles = ({ typography, palette, spacing }: Theme) => ({
  appBar: css`
    width: calc(100% - ${SIDE_MENU_WIDTH}px) !important;
    z-index: 1000 !important;
  `,
  menu: css`
    z-index: 1000;
  `,
  menuList: css`
    > li {
      font-size: ${typography.fontSize}px;
    }
    > a {
      font-size: ${typography.fontSize}px;
    }
  `,
  switch: css`
    cursor: default !important;
    padding-top: 0 !important;
    padding-bottom: 0 !important;
    justify-content: space-between !important;
  `,
  userDataText: css`
    cursor: default !important;
    color: ${palette.text.secondary} !important;
  `,
  pageTitle: css`
    padding-left: ${spacing(3)};
  `,
});
