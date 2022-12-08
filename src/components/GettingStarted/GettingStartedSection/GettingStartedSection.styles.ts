import { css } from 'emotion';
import { Theme } from '@mui/material';

const TICK_IMG_SIZE = '50px';

export const getStyles = ({ palette, spacing, typography }: Theme) => ({
  description: css`
    flex: 1;
    margin-right: ${spacing(3)};
  `,
  descriptionWrapper: css`
    align-items: center;
    display: flex;
    margin-left: calc(${TICK_IMG_SIZE} + ${spacing(3)});
  `,
  header: css`
    align-items: center;
    display: flex;

    > img {
      height: 50px;
      margin-right: ${spacing(3)};
      transition: 500ms;
    }
  `,
  title: css`
    margin: ${spacing(2)} 0;
    font-weight: ${typography.fontWeightMedium};
  `,
  link: css`
    align-items: center;
    display: flex;
    flex-direction: column;
    text-decoration: none !important;
    width: ${spacing(25)};
  `,
  readMoreLink: css`
    text-decoration: none !important;
    line-height: 1;

    & > * {
      padding: 0;
    }
  `,
  linkDisabled: css`
    pointer-events: none;
  `,
  section: css`
    color: ${palette.text.primary};
    width: 100%;
  `,
  loadingMessage: css`
    align-items: center;
    color: ${palette.text.primary};
    display: flex;
    font-weight: ${typography.fontWeightMedium};
    justify-content: center;
    margin-bottom: ${spacing(0)};
    width: ${spacing(25)};
  `,
  tickImage: css`
    position: absolute;
    opacity: 0;
  `,
  showTick: css`
    opacity: 1;
  `,
  hideTickBg: css`
    opacity: 0;
  `,
});
