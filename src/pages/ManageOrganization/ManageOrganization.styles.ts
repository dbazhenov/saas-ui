import { css } from 'emotion';
import { Theme } from '@mui/material';

export const getStyles = ({ palette, spacing }: Theme) => ({
  container: css`
    color: ${palette.text.primary};
    display: flex;
    flex-direction: column;
    flex: 1;
  `,
  tabsWrapperLoading: css`
    align-items: center;
    display: flex;
    justify-content: center;
    height: 350px;
  `,
  tabsWrapper: css`
    padding-bottom: ${spacing(3)};
  `,
});
