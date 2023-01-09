import React from 'react';
import { Tooltip } from '@mui/material';
import { GridRenderCellParams } from '@mui/x-data-grid';

export const TableCellWithTooltip = ({ value }: GridRenderCellParams<any, any, any>) => (
  <Tooltip title={value}>
    <span className="MuiDataGrid-cellContent">{value}</span>
  </Tooltip>
);
