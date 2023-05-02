import { Theme } from '@mui/material';
import { css } from 'emotion';

export const getStyles = ({ spacing, palette, typography }: Theme) => ({
  dbaasWrapper: css`
    width: 100%;
  `,
  pageWrapper: css`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  `,
  contentWrapper: css`
    max-width: 810px;
  `,
  card: css`
    width: 810px;
    padding: ${spacing(2)};
    display: flex;
    flex-direction: row;
    align-items: center;
  `,
  stepsContainer: css`
    width: 100%;
  `,
  title: css`
    font-size: 23px;
    color: ${palette.text.primary};
    font-weight: 600;
    margin-bottom: ${spacing(2)};
  `,
  readMoreWrapper: css`
    margin: ${spacing(2.5)} 0 0 ${spacing(0.5)} !important;
    color: ${palette.primary.dark};
    display: flex;
    flex-direction: row;
    align-items: center;
    font-weight: ${typography.fontWeightMedium};
  `,
  feedIcon: css`
    width: 18px;
    height: 18px;
    margin-right: ${spacing(1.3)};
  `,
  loader: css`
    text-align: center;
  `,
});
