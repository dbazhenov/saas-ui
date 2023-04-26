import React, { FC } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { LinearProgress } from '@mui/material';
import { useStyles } from 'core/utils';
import { AdvisorsTableProps } from './AdvisorsTable.types';
import { getStyles } from './AdvisorsTable.styles';

export const AdvisorsTable: FC<AdvisorsTableProps> = ({ advisors }) => {
  const styles = useStyles(getStyles);

  const columns = [
    {
      field: 'summary',
      flex: 1,
      headerName: 'Name',
      cellClassName: 'cell',
    },
    {
      field: 'description',
      flex: 3,
      headerName: 'Description',
      cellClassName: 'cell',
    },
  ];

  const tableComponents = {
    LoadingOverlay: LinearProgress,
  };

  return (
    <div className={styles.tableWrapper} data-testid="checks-datagrid">
      <DataGrid
        sx={{
          border: 'none',
          '& .cell': {
            whiteSpace: 'normal !important',
            padding: '16px 10px',
          },
        }}
        getRowHeight={() => 'auto'}
        autoHeight
        columns={columns}
        components={tableComponents}
        disableColumnMenu
        disableSelectionOnClick
        getRowId={(row: { name: string }) => row.name}
        hideFooter
        rows={advisors}
      />
    </div>
  );
};
