import React, { FC, useCallback, useMemo, useState, useEffect } from 'react';
import { logger, Table } from '@percona/platform-core';
import { useStyles } from '@grafana/ui';
import { Column, Row } from 'react-table';
import { toast } from 'react-toastify';
import { OrgTicket } from './TicketList.types';
import { Messages } from './TicketList.messages';
import { getTickets } from './TicketList.service';
import { TicketStatus } from './TicketStatus';
import { getStyles } from './TicketList.styles';

export const TicketList: FC = () => {
  const styles = useStyles(getStyles);
  const [tickets, setTickets] = useState<OrgTicket[]>([]);
  const [pending, setPending] = useState(false);
  const columns: Column<any>[] = useMemo(
    (): Array<Column<OrgTicket>> => [
      {
        Header: Messages.columns.number,
        accessor: 'number',
      },
      {
        Header: Messages.columns.requester,
        accessor: 'requester',
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
        Header: Messages.columns.status,
        accessor: 'status',
        Cell: ({ row: { original: { status } } }) => <TicketStatus status={status} />,
      },
      {
        Header: Messages.columns.date,
        accessor: 'date',
        Cell: ({ row: { original: { date } } }) => new Date(date).toLocaleDateString(),
      },
    ],
    [],
  );
  const getRowProps = useCallback(({ id, original: { url } }: Row<OrgTicket>) => ({
    key: id,
    className: styles.row,
    onClick: () => window.open(url, '_blank', 'noopener,noreferrer'),
  }), [styles]);

  useEffect(() => {
    const getData = async() => {
      setPending(true);

      try {
        const ticketData = await getTickets();

        setTickets(ticketData);
      } catch (e) {
        toast.error(Messages.errorFetching);
        logger.error(e);
      } finally {
        setPending(false);
      }
    };

    getData();
  }, []);

  return (
    <Table
      pendingRequest={pending}
      totalItems={tickets.length}
      columns={columns}
      data={tickets}
      getRowProps={getRowProps}
    />
  );
};
