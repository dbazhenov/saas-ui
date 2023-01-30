import React, { useEffect, useState } from 'react';
import { LinearProgress, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { DataGrid, GridColDef, GridSortModel } from '@mui/x-data-grid';
import { useStyles } from 'core';
import { useEventSearchMutation } from 'core/api/events.service';
import { format } from 'date-fns';
import { AuditEvent, AuditObject, EventType } from 'core/api/types';
import { useSelector } from 'react-redux';
import { getFirstOrgId } from 'store/orgs';
import { Messages } from './ActivityLog.messages';
import { getStyles } from './ActivityLog.styles';
import {
  auditObjectTypeMapping,
  eventTypeMapping,
  FilterType,
  timestampRange,
  TimestampRangeType,
} from './ActivityLog.constants';
import { TableCellWithTooltip } from './TableCellWithTooltip';

export const ActivityLog = () => {
  const [eventSearch, { data, isLoading }] = useEventSearchMutation();
  const orgId = useSelector(getFirstOrgId);
  const styles = useStyles(getStyles);
  const [rowCount, setRowCount] = useState(10);
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(0);
  const [timeframe, setTimeframe] = useState<TimestampRangeType>(TimestampRangeType.LAST_24_HOURS);
  const [sortModel, setSortModel] = useState<GridSortModel>([
    {
      field: 'timestamp',
      sort: 'desc',
    },
  ]);

  useEffect(() => {
    if (data) {
      setRowCount(data.page_totals.total_items);
    }
  }, [data]);

  useEffect(() => {
    eventSearch({
      fsp: {
        page_params: { page_size: pageSize, index: pageIndex },
        filters: [
          {
            field: {
              name: 'organization_id',
              value: orgId,
            },
          },
          {
            field: {
              name: 'timestamp',
              value: timestampRange()[timeframe][0].toISOString(),
            },
            filter_type: FilterType.GREATER_OR_EQUAL,
          },
          {
            field: {
              name: 'timestamp',
              value: timestampRange()[timeframe][1].toISOString(),
            },
            filter_type: FilterType.LESS_OR_EQUAL,
          },
        ],
        sorting_params: sortModel?.map((item) => ({
          field_name: item.field as string,
          order: item.sort === 'asc' ? 0 : 1,
        }))[0] || {
          field_name: 'timestamp',
          order: 1,
        },
      },
    });
  }, [pageSize, pageIndex, timeframe, sortModel, eventSearch, orgId]);

  const handlePageChange = (newPageIndex: number) => setPageIndex(newPageIndex);
  const handlePageSizeChange = (newPageSize: number) => setPageSize(newPageSize);
  const handleSelectTimeframe = (e: SelectChangeEvent<TimestampRangeType>) => {
    setPageIndex(0);
    setTimeframe(e.target.value as TimestampRangeType);
  };
  const handleSortModelChange = (model: GridSortModel) => setSortModel(model);

  const getListOfAffectedObjects = (auditObjects: AuditObject[]) =>
    auditObjects.map((auditObject, index) =>
      index === auditObjects.length - 1
        ? `"${auditObject.name}" ${auditObjectTypeMapping[auditObject.type]}`
        : `"${auditObject.name}" ${auditObjectTypeMapping[auditObject.type]},`,
    );

  const getDetailsText = ({ row }: { row: AuditEvent }) => {
    if ([EventType.LOG_IN, EventType.LOG_OUT, EventType.CHANGE_PASSWORD].includes(row.action_type)) {
      return `User ${row.okta_user_id} ${eventTypeMapping[row.action_type]}`;
    }

    return `User ${row.okta_user_id} ${eventTypeMapping[row.action_type]} ${getListOfAffectedObjects(
      row.objects,
    )}`;
  };

  const columns: GridColDef[] = [
    {
      field: 'timestamp',
      headerName: Messages.time,
      flex: 1,
      valueFormatter: ({ value }) => format(new Date(value), 'P - p'),
      renderCell: TableCellWithTooltip,
    },
    {
      field: 'okta_user_id',
      flex: 1,
      headerName: Messages.userId,
    },
    {
      field: 'action_type',
      flex: 1,
      headerName: Messages.eventType,
    },
    {
      field: 'details',
      flex: 2,
      headerName: Messages.details,
      valueGetter: getDetailsText,
      sortable: false,
      renderCell: TableCellWithTooltip,
    },
  ];

  const tableComponents = {
    LoadingOverlay: LinearProgress,
  };

  return (
    <div className={styles.tableWrapper} data-testid="activity-log-list-wrapper">
      <div className={styles.filters}>
        <Select value={timeframe} onChange={handleSelectTimeframe}>
          <MenuItem value={TimestampRangeType.LAST_24_HOURS}>{Messages.timeframe.last24Hours}</MenuItem>
          <MenuItem value={TimestampRangeType.LAST_48_HOURS}>{Messages.timeframe.last48Hours}</MenuItem>
          <MenuItem value={TimestampRangeType.LAST_3_DAYS}>{Messages.timeframe.last3Days}</MenuItem>
          <MenuItem value={TimestampRangeType.LAST_WEEK}>{Messages.timeframe.lastWeek}</MenuItem>
          <MenuItem value={TimestampRangeType.LAST_MONTH}>{Messages.timeframe.lastMonth}</MenuItem>
          <MenuItem value={TimestampRangeType.LAST_3_MONTHS}>{Messages.timeframe.last3Months}</MenuItem>
          <MenuItem value={TimestampRangeType.LAST_6_MONTHS}>{Messages.timeframe.last6Months}</MenuItem>
          <MenuItem value={TimestampRangeType.LAST_YEAR}>{Messages.timeframe.lastYear}</MenuItem>
        </Select>
      </div>
      <DataGrid
        autoHeight
        columns={columns}
        components={tableComponents}
        disableColumnMenu
        disableSelectionOnClick
        getRowId={(row) => row.id}
        loading={isLoading}
        rows={data ? data.events : []}
        rowCount={rowCount}
        pageSize={pageSize}
        onSortModelChange={handleSortModelChange}
        page={pageIndex}
        onPageChange={handlePageChange}
        rowsPerPageOptions={[10, 15, 30]}
        onPageSizeChange={handlePageSizeChange}
        pagination
        paginationMode="server"
        columnBuffer={4}
      />
    </div>
  );
};
