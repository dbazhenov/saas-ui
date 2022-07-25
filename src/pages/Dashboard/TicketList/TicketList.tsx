import React, { FC, useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Table } from '@percona/platform-core';
import { useStyles } from '@grafana/ui';
import { Column, Row } from 'react-table';
import { openNewTab } from 'core';
import { getOrgTickets, getOrgTicketsPending } from 'store/orgs';
import { OrgTicket } from './TicketList.types';
import { Messages } from './TicketList.messages';
import { TicketStatus } from './TicketStatus';
import { getStyles } from './TicketList.styles';

export const TicketList: FC = () => {
  const styles = useStyles(getStyles);
  const tickets = useSelector(getOrgTickets);
  const isLoadingTickets = useSelector(getOrgTicketsPending);

  const columns: Column<any>[] = useMemo(
    (): Array<Column<OrgTicket>> => [
      {
        Header: Messages.columns.number,
        accessor: 'number',
      },
      {
        Header: Messages.columns.status,
        accessor: 'status',
        Cell: ({
          row: {
            original: { status },
          },
        }) => <TicketStatus status={status} />,
      },
      {
        Header: Messages.columns.description,
        accessor: 'description',
      },
      {
        Header: Messages.columns.category,
        accessor: 'department',
      },
      {
        Header: Messages.columns.priority,
        accessor: 'priority',
      },
      {
        Header: Messages.columns.date,
        accessor: 'date',
        Cell: ({
          row: {
            original: { date },
          },
        }) => new Date(date).toLocaleDateString(),
      },
      {
        Header: Messages.columns.requester,
        accessor: 'requester',
      },
    ],
    [],
  );
  const getRowProps = useCallback(
    ({ id, original: { url } }: Row<OrgTicket>) => ({
      key: id,
      className: styles.row,
      onClick: () => openNewTab(url),
    }),
    [styles],
  );

  return (
    <Table
      pendingRequest={isLoadingTickets}
      emptyMessage={Messages.emptyMessage}
      totalItems={tickets.length}
      columns={columns}
      data={tickets}
      getRowProps={getRowProps}
      showPagination
      sortingOnColumns
    />
  );
};
