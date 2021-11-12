import React, { FC, useMemo } from 'react';
import { Column } from 'react-table';
import { Table } from '@percona/platform-core';
import { useStyles } from '@grafana/ui';
import { ReactComponent as UserAvatar } from 'assets/user-avatar.svg';
import { ReactComponent as Clock } from 'assets/clock.svg';
import { getStyles } from './MembersList.styles';
import { Messages } from './MembersList.messages';
import { MembersListProps } from './MembersList.types';
import { Member, MemberStatus } from '../ManageOrganization.types';

export const MembersList: FC<MembersListProps> = ({ loading, members }) => {
  const styles = useStyles(getStyles);
  const columns = useMemo<Column<Member>[]>(
    () => [
      {
        Header: Messages.name,
        accessor: ({ firstName, lastName, status }: Member) => {
          const fullName = `${firstName} ${lastName}`;

          return (
            <>
              {status === MemberStatus.active ? (
                <div className={styles.fullNameWrapper}>
                  <UserAvatar className={styles.userAvatarIcon} />
                  <span className={styles.fullName}>{fullName}</span>
                </div>
              ) : (
                <div className={styles.clockIconWrapper}>
                  <Clock className={styles.clockIcon} />
                </div>
              )}
            </>
          );
        },
        width: '30%',
      },
      {
        Header: Messages.email,
        accessor: 'email',
        width: '45%',
      },
      {
        Header: Messages.role,
        accessor: 'role',
        width: '25%',
      },
    ],
    [styles],
  ) as any;

  return (
    <div data-testid="members-list-wrapper" className={styles.tableWrapper}>
      <Table
        data={members}
        totalItems={members.length}
        columns={columns}
        emptyMessage={Messages.noData}
        pendingRequest={loading}
      />
    </div>
  );
};
