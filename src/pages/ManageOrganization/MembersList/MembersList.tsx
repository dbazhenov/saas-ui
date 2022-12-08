import React, { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LinearProgress } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { useStyles } from 'core/utils';
import { OrgMember } from 'store/types';
import { getFirstOrgId, getOrgMembers, getIsOrgPending, searchOrgMembersAction } from 'store/orgs';
import { ReactComponent as UserAvatar } from 'assets/user-avatar.svg';
import { ReactComponent as Clock } from 'assets/clock.svg';
import { getAuth } from 'store/auth';
import { getStyles } from './MembersList.styles';
import { Messages } from './MembersList.messages';
import { MemberRole, MemberStatus } from '../ManageOrganization.types';
import { MemberActions } from './MemberActions';
import { ResendEmailLink } from './ResendEmailLink/ResendEmailLink';

export const MembersList: FC = () => {
  const styles = useStyles(getStyles);
  const dispatch = useDispatch();
  const pending = useSelector(getIsOrgPending);
  const members = useSelector(getOrgMembers);
  const orgId = useSelector(getFirstOrgId);
  const { orgRole } = useSelector(getAuth);

  const columns: GridColDef[] = [
    {
      field: 'name',
      flex: 2,
      headerName: Messages.name,
      renderCell: ({ row: { firstName, lastName, status, memberId } }: GridRenderCellParams<OrgMember>) => {
        const fullName = `${firstName} ${lastName}`;

        return (
          <div>
            {status === MemberStatus.active ? (
              <div className={styles.fullNameWrapper}>
                <div className={styles.userAvatarIcon}>
                  <UserAvatar />
                </div>
                <span className={styles.fullName}>{fullName}</span>
              </div>
            ) : (
              <div className={styles.clockIconWrapper} data-testid="user-not-activated">
                <div className={styles.clockIcon}>
                  <Clock title={Messages.pendingConfirmation} />
                </div>
                {orgRole === MemberRole.admin && status === MemberStatus.provisioned && (
                  <ResendEmailLink organization={orgId} member={memberId} />
                )}
              </div>
            )}
          </div>
        );
      },
    },
    {
      field: 'email',
      flex: 3,
      headerName: Messages.email,
    },
    {
      field: 'role',
      headerName: Messages.role,
    },
    {
      align: 'center',
      field: 'member',
      headerName: Messages.actions,
      renderCell: ({ row }: GridRenderCellParams<OrgMember>) => <MemberActions member={row} />,
    },
  ];

  useEffect(() => {
    if (orgId && !pending && !members.length) {
      dispatch(searchOrgMembersAction({ orgId }));
    }
  }, [dispatch, orgId, members, pending]);

  const tableComponents = {
    LoadingOverlay: LinearProgress,
  };

  return (
    <div className={styles.tableWrapper} data-testid="members-list-wrapper">
      <DataGrid
        autoHeight
        columns={columns}
        components={tableComponents}
        disableColumnMenu
        disableSelectionOnClick
        getRowId={(row) => row.email}
        hideFooter
        loading={pending}
        rows={members}
      />
    </div>
  );
};
