import React, { FC, useMemo } from 'react';
import { Column } from 'react-table';
import { Table } from '@percona/platform-core';
import { Button, useStyles } from '@grafana/ui';
import { PmmInstance } from 'store/types';
import { getStyles } from './PmmInstanceList.styles';
import { Messages } from './PmmInstanceList.messages';
import { PmmInstanceListProps } from './PmmInstanceList.types';

export const PmmInstanceList: FC<PmmInstanceListProps> = ({ pmmInstances, loading }) => {
  const styles = useStyles(getStyles);
  const columns = useMemo<Column<PmmInstance>[]>(
    () => [
      {
        Header: Messages.name,
        accessor: 'name',
        width: '35%',
      },
      {
        Header: Messages.id,
        accessor: 'id',
        width: '35%',
      },
      {
        Header: Messages.url,
        accessor: 'url',
        Cell: ({ row: { original: { url } } }) => (
          <a href={url} className={styles.instanceServerLink} target="_blank" rel="noreferrer">
            <Button variant="link">{url}</Button>
          </a>
        ),
        width: '30%',
      },
    ],
    [styles],
  ) as any;

  return (
    <div data-testid="instances-list-wrapper" className={styles.tableWrapper}>
      <Table
        data={pmmInstances}
        totalItems={pmmInstances.length}
        columns={columns}
        emptyMessage={Messages.noData}
        pendingRequest={loading}
      />
    </div>
  );
};
