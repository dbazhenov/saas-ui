import React, { FC } from 'react';
import { useStyles } from 'core/utils';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { SimpleDialog } from 'components';
import { Button } from '@mui/material';

import { getStyles } from './WelcomeModal.styles';
import { Messages } from './WelcomeModal.messages';
import { WelcomeModalProps } from './WelcomeModal.types';

export const WelcomeModal: FC<WelcomeModalProps> = ({ isModalVisible, onToggle, title, children }) => {
  const styles = useStyles(getStyles);
  const DialogActions = (
    <div className={styles.actions}>
      <Button type="button" onClick={onToggle} variant="contained" data-testid="welcome-modal-start-button">
        {Messages.start}
      </Button>
    </div>
  );

  return (
    <>
      <div className={styles.infoButton}>
        <Button onClick={onToggle} startIcon={<HelpOutlineIcon />} data-testid="welcome-more-info-button">
          {Messages.moreInfo}
        </Button>
      </div>
      <SimpleDialog
        maxWidth="md"
        title={title}
        open={isModalVisible}
        onClose={onToggle}
        actions={DialogActions}
        classes={{ root: styles.root }}
      >
        {children}
      </SimpleDialog>
    </>
  );
};
