import React, { FC, useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useStyles, IconButton } from '@grafana/ui';
import { getAuth } from 'store/auth';
import { editOrgMemberAction, getFirstOrgId, removeOrgMemberAction } from 'store/orgs';
import { getStyles } from './MemberActions.styles';
import { MemberActionsProps } from './MemberActions.types';
import { EditMemberFormFields, MemberRole } from '../../ManageOrganization.types';
import { Messages } from './MembersActions.messages';
import { MemberEditModal } from './MemberEditModal';
import { MemberDeleteModal } from './MemberDeleteModal';

export const MemberActions: FC<MemberActionsProps> = ({ member }) => {
  const { memberId } = member;
  const styles = useStyles(getStyles);
  const { email, orgRole } = useSelector(getAuth);
  const orgId = useSelector(getFirstOrgId);
  const dispatch = useDispatch();
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  const isActionDisabled = useMemo(
    () => email === member.email || orgRole !== MemberRole.admin,
    [email, orgRole, member],
  );

  const handleDeleteModalClose = () => {
    setIsDeleteModalVisible(false);
  };

  const handleDeleteMemberClick = () => {
    setIsDeleteModalVisible(true);
  };

  const handleDeleteMemberSubmit = useCallback(() => {
    setIsDeleteModalVisible(false);
    dispatch(removeOrgMemberAction({ orgId, memberId }));
  }, [dispatch, orgId, memberId]);

  const handleEditModalClose = () => {
    setIsEditModalVisible(false);
  };

  const handleEditMemberClick = () => {
    setIsEditModalVisible(true);
  };

  const handleEditMemberSubmit = useCallback((formData: EditMemberFormFields) => {
    setIsEditModalVisible(false);
    dispatch(editOrgMemberAction({ orgId, memberId, role: formData.role.value! }));
  }, [dispatch, orgId, memberId]);

  return (
    <>
      <div className={styles.actionsWrapper} data-testid="member-actions">
        <IconButton
          className={styles.actionButton}
          data-testid="member-actions-edit"
          disabled={isActionDisabled}
          name="pen"
          onClick={handleEditMemberClick}
          title={Messages.edit}
        />
        <IconButton
          className={styles.actionButton}
          data-testid="member-actions-delete"
          disabled={isActionDisabled}
          name="trash-alt"
          onClick={handleDeleteMemberClick}
          title={Messages.delete}
        />
      </div>
      <MemberEditModal
        member={member}
        isVisible={isEditModalVisible}
        onSubmit={handleEditMemberSubmit}
        onClose={handleEditModalClose}
      />
      <MemberDeleteModal
        member={member}
        isVisible={isDeleteModalVisible}
        onSubmit={handleDeleteMemberSubmit}
        onClose={handleDeleteModalClose}
      />
    </>
  );
};
