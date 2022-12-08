import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { DataGrid, GridRenderCellParams, GridEventListener, GridColDef } from '@mui/x-data-grid';
import { openNewTab } from 'core';
import { useStyles } from 'core/utils';
import { getOrgTickets, getOrgTicketsPending } from 'store/orgs';
import { OrgTicketStatus } from 'core/api/types';
import { Messages } from './TicketList.messages';
import { TicketStatus } from './TicketStatus';
import { getStyles } from './TicketList.styles';
import { ROWS_PER_PAGE_CHOICES } from './TicketList.constants';

export const TicketList: FC = () => {
  const tickets = useSelector(getOrgTickets);
  const isLoadingTickets = useSelector(getOrgTicketsPending);
  const styles = useStyles(getStyles);

  const columns: GridColDef[] = [
    {
      field: 'number',
      headerName: Messages.columns.number,
    },
    {
      field: 'status',
      headerName: Messages.columns.status,
      renderCell: ({ value }: GridRenderCellParams<OrgTicketStatus>) => <TicketStatus status={value!} />,
    },
    {
      field: 'description',
      flex: 2,
      headerName: Messages.columns.description,
    },
    {
      field: 'department',
      flex: 1,
      headerName: Messages.columns.category,
    },
    {
      field: 'priority',
      headerName: Messages.columns.priority,
    },
    {
      field: 'date',
      flex: 1,
      headerName: Messages.columns.date,
      renderCell: ({ value }: GridRenderCellParams<string>) => new Date(value!).toLocaleDateString(),
    },
    {
      field: 'requester',
      flex: 1,
      headerName: Messages.columns.requester,
    },
  ];

  const handleRowClick: GridEventListener<'rowClick'> = (params, event, details) => {
    openNewTab(params.row.url);
  };

  return (
    <DataGrid
      autoHeight
      className={styles.table}
      columns={columns}
      components={{
        NoRowsOverlay: () => (
          <div className={styles.emptyMessage} data-testid="table-no-data">
            {Messages.emptyMessage}
          </div>
        ),
      }}
      disableColumnMenu
      disableSelectionOnClick
      getRowId={(row) => `row-${row.number}`}
      initialState={{
        pagination: {
          pageSize: ROWS_PER_PAGE_CHOICES[0],
        },
      }}
      loading={isLoadingTickets}
      onRowClick={handleRowClick}
      rows={tickets}
      rowsPerPageOptions={ROWS_PER_PAGE_CHOICES}
    />
  );
};
