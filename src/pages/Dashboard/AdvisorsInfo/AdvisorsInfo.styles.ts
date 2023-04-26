import { css } from 'emotion';
import { Theme } from '@mui/material';

export const getStyles = ({ spacing, palette, typography }: Theme) => ({
  advisorsInfo: css`
    width: 352px;
  `,
  title: css`
    font-size: ${typography.h6.fontSize};
    font-weight: ${typography.fontWeightMedium};
    margin: ${spacing(2)} 0 ${spacing(2)} ${spacing(2)};
  `,
  imageWrapper: css`
    text-align: center;
    margin-bottom: ${spacing(5)};
  `,
  description: css`
    margin: 0 ${spacing(3)} ${spacing(1)} ${spacing(2)};
    font-size: ${typography.fontSize}px;
  `,
  goToAdvisors: css`
    display: block !important;
    margin: 0 auto ${spacing(3)} !important;
    line-height: 21px;
  `,
  advisorsWidgetImg: css`
    color: ${palette.primary.main};
    fill: ${palette.info.contrastText};
  `,
});
