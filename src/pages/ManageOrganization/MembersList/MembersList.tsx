import React, { FC, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Column } from 'react-table';
import { Table } from '@percona/platform-core';
import { useStyles } from '@grafana/ui';
import { OrgMember } from 'store/types';
import { getFirstOrgId, getOrgMembers, getIsOrgPending, searchOrgMembersAction } from 'store/orgs';
import { ReactComponent as UserAvatar } from 'assets/user-avatar.svg';
import { ReactComponent as Clock } from 'assets/clock.svg';
import { getStyles } from './MembersList.styles';
import { Messages } from './MembersList.messages';
import { MemberStatus } from '../ManageOrganization.types';
import { MemberActions } from './MemberActions';

export const MembersList: FC = () => {
  const styles = useStyles(getStyles);
  const dispatch = useDispatch();
  const pending = useSelector(getIsOrgPending);
  const members = useSelector(getOrgMembers);
  const orgId = useSelector(getFirstOrgId);
  const columns = useMemo<Column<OrgMember>[]>(
    () => [
      {
        Header: Messages.name,
        accessor: ({ firstName, lastName, status }: OrgMember) => {
          const fullName = `${firstName} ${lastName}`;

          return (
            <>
              {status === MemberStatus.active ? (
                <div className={styles.fullNameWrapper}>
                  <UserAvatar className={styles.userAvatarIcon} />
                  <span className={styles.fullName}>{fullName}</span>
                </div>
              ) : (
                <div className={styles.clockIconWrapper} data-testid="user-not-activated">
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
        width: '40%',
      },
      {
        Header: Messages.role,
        accessor: 'role',
        width: '25%',
      },
      {
        Header: Messages.actions,
        accessor: (member: OrgMember) => <MemberActions member={member} />,
        width: '5%',
      },
    ],
    [styles],
  ) as any;

  useEffect(() => {
    if (orgId && !pending && !members.length) {
      dispatch(searchOrgMembersAction({ orgId }));
    }
  }, [dispatch, orgId, members, pending]);

  return (
    <div data-testid="members-list-wrapper" className={styles.tableWrapper}>
      <Table
        data={members}
        totalItems={members.length}
        columns={columns}
        emptyMessage={Messages.noData}
        pendingRequest={pending}
      />
    </div>
  );
};
