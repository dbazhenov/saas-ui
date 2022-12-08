import React, { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useStyles } from 'core/utils';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Link } from '@mui/material';
import { getAuth } from 'store/auth';
import { PmmInstance } from 'store/types';
import { getUserRoleAction } from 'store/orgs';
import { getStyles } from './PmmInstanceList.styles';
import { Messages } from './PmmInstanceList.messages';
import { PmmInstanceListProps } from './PmmInstanceList.types';
import { PmmInstanceActions } from './PmmInstanceActions';

export const PmmInstanceList: FC<PmmInstanceListProps> = ({ pmmInstances, loading }) => {
  const styles = useStyles(getStyles);
  const dispatch = useDispatch();
  const { orgRole } = useSelector(getAuth);

  // FIXME: this should be done elsewhere
  useEffect(() => {
    if (orgRole === '') {
      dispatch(getUserRoleAction());
    }
  }, [dispatch, orgRole]);

  const columns: GridColDef[] = [
    {
      field: 'name',
      flex: 1,
      headerName: Messages.name,
    },
    {
      field: 'id',
      flex: 1,
      headerName: Messages.id,
    },
    {
      field: 'url',
      flex: 1,
      headerName: Messages.url,
      renderCell: ({ value }: GridRenderCellParams<string>) => (
        <Link href={value} target="_blank" rel="noreferrer">
          {value}
        </Link>
      ),
    },
    {
      align: 'center',
      field: 'instance',
      headerName: Messages.actions,
      renderCell: ({ row }: GridRenderCellParams<PmmInstance>) => <PmmInstanceActions instance={row} />,
    },
  ];

  return (
    <div data-testid="instances-list-wrapper" className={styles.tableWrapper}>
      <DataGrid
        autoHeight
        columns={columns}
        components={{
          NoRowsOverlay: () => <div className={styles.emptyMessage}>{Messages.noData}</div>,
        }}
        disableColumnMenu
        disableSelectionOnClick
        hideFooter
        loading={loading}
        rows={pmmInstances}
      />
    </div>
  );
};
