import React, { FC, useContext, useMemo, useState } from 'react';
import { useStyles, IconButton } from '@grafana/ui';
import { getStyles } from './MemberActions.styles';
import { MemberActionsProps } from './MemberActions.types';
import { EditMemberFormFields, MemberRole } from '../../ManageOrganization.types';
import { Messages } from './MembersActions.messages';
import { ManageOrganizationProvider } from '../../ManageOrganization.provider';
import { MemberEditModal } from './MemberEditModal';
import { MemberDeleteModal } from './MemberDeleteModal';

export const MemberActions: FC<MemberActionsProps> = ({ member }) => {
  const {
    onEditMemberSubmit,
    onDeleteMemberSubmit,
    loading,
    userInfo,
    userRole,
  } = useContext(ManageOrganizationProvider);
  const { memberId } = member;
  const styles = useStyles(getStyles);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  const isActionDisabled = useMemo(
    () => userInfo.email === member.email || userRole !== MemberRole.admin,
    [userInfo.email, userRole, member],
  );

  const handleDeleteModalClose = () => {
    setIsDeleteModalVisible((currentValue) => !currentValue);
  };

  const handleDeleteMemberClick = () => {
    setIsDeleteModalVisible(true);
  };

  const handleDeleteMemberSubmit = async () => {
    setIsDeleteModalVisible(false);
    await onDeleteMemberSubmit({ memberId });
  };

  const handleEditModalClose = () => {
    setIsEditModalVisible((currentValue) => !currentValue);
  };

  const handleEditMemberClick = () => {
    setIsEditModalVisible(true);
  };

  const handleEditMemberSubmit = async (formData: EditMemberFormFields) => {
    setIsEditModalVisible(false);
    await onEditMemberSubmit({ role: formData.role, memberId });
  };

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
        loading={loading}
        isVisible={isEditModalVisible}
        onSubmit={handleEditMemberSubmit}
        onClose={handleEditModalClose}
      />
      <MemberDeleteModal
        member={member}
        loading={loading}
        isVisible={isDeleteModalVisible}
        onSubmit={handleDeleteMemberSubmit}
        onClose={handleDeleteModalClose}
      />
    </>
  );
};
