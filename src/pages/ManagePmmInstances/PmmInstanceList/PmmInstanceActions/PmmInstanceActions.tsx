import React, { FC, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IconButton } from '@mui/material';
import { RemoveCircleOutline } from '@mui/icons-material';
import { getAuth } from 'store/auth';
import { useStyles } from 'core/utils';
import { removePmmInstanceAction } from 'store/orgs';
import { getStyles } from './PmmInstanceActions.styles';
import { PmmInstanceActionsProps } from './PmmInstanceActions.types';
import { Messages } from './PmmInstanceActions.messages';
import { PmmInstanceRemoveModal } from './PmmInstanceRemoveModal';
import { MemberRole } from '../../../ManageOrganization/ManageOrganization.types';

export const PmmInstanceActions: FC<PmmInstanceActionsProps> = ({ instance }) => {
  const styles = useStyles(getStyles);
  const { orgRole } = useSelector(getAuth);
  const dispatch = useDispatch();
  const [isRemoveModalVisible, setIsRemoveModalVisible] = useState(false);

  const isActionDisabled = useMemo(() => orgRole !== MemberRole.admin, [orgRole]);

  const handleRemoveModalClose = () => {
    setIsRemoveModalVisible(false);
  };

  const handleRemoveInstanceClick = () => {
    setIsRemoveModalVisible(true);
  };

  const handleRemoveInstanceSubmit = () => {
    setIsRemoveModalVisible(false);
    dispatch(removePmmInstanceAction(instance.id));
  };

  return (
    <>
      <div className={styles.actionsWrapper} data-testid="member-actions">
        <IconButton
          className={styles.actionButton}
          data-testid="pmm-instance-actions-remove"
          disabled={isActionDisabled}
          onClick={handleRemoveInstanceClick}
          title={Messages.remove}
        >
          <RemoveCircleOutline />
        </IconButton>
      </div>
      <PmmInstanceRemoveModal
        instance={instance}
        isVisible={isRemoveModalVisible}
        onSubmit={handleRemoveInstanceSubmit}
        onClose={handleRemoveModalClose}
      />
    </>
  );
};
