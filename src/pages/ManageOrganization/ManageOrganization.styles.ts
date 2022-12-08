import { css } from 'emotion';
import { Theme } from '@mui/material';

export const getStyles = ({ palette, typography, spacing }: Theme) => ({
  container: css`
    color: ${palette.text.primary};
    display: flex;
    flex-direction: column;
    flex: 1;
  `,
  header: css`
    align-items: center;
    display: flex;
    margin: 0 0 ${spacing(2)};

    svg {
      height: 28px;
      margin-right: ${spacing(2)};
    }
  `,
  tabsWrapperLoading: css`
    align-items: center;
    display: flex;
    justify-content: center;
    height: 350px;
  `,
  tabsWrapper: css`
    padding: ${spacing(3)};
  `,
});
