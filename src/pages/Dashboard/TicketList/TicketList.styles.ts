import { css } from 'emotion';

export const getStyles = () => ({
  table: css`
    & .MuiDataGrid-row {
      cursor: pointer;
    }
  `,
  emptyMessage: css`
    display: flex;
    height: 100%;
    justify-content: center;
    align-items: center;
  `,
});
