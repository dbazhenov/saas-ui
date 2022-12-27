import React from 'react';
import { GridRenderCellParams } from '@mui/x-data-grid';
import { useStyles } from 'core';
import { getStyles } from './TableCell.styles';

export const TableCell = ({ formattedValue }: GridRenderCellParams<any, any, any>) => {
  const styles = useStyles(getStyles);

  return (
    <div title={formattedValue} className={styles.scrollableCell}>
      {formattedValue}
    </div>
  );
};
