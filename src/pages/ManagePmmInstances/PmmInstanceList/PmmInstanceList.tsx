import React, { FC, useEffect, useMemo } from 'react';
import { Column } from 'react-table';
import { useDispatch, useSelector } from 'react-redux';
import { Table } from '@percona/platform-core';
import { Button, useStyles } from '@grafana/ui';
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
        Cell: ({
          row: {
            original: { url },
          },
        }) => (
          <a href={url} className={styles.instanceServerLink} target="_blank" rel="noreferrer">
            <Button variant="link">{url}</Button>
          </a>
        ),
        width: '25%',
      },
      {
        Header: Messages.actions,
        accessor: (instance: PmmInstance) => <PmmInstanceActions instance={instance} />,
        width: '5%',
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
