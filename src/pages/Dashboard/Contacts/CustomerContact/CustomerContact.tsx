import React, { FC, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { IconButton, Typography } from '@mui/material';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import { useStyles } from 'core';
import { getCustomerSuccessContact } from 'store/orgs';
import { getStyles } from './CustomerContact.styles';
import { Messages } from './CustomerContact.messages';

export const CustomerContact: FC = () => {
  const styles = useStyles(getStyles);
  const { name, email } = useSelector(getCustomerSuccessContact);

  const copyToClipboard = useCallback(async () => {
    await navigator.clipboard.writeText(email);
    toast.success(Messages.copiedSuccessfully);
  }, [email]);

  return (
    <div className={styles.wrapper} data-testid="customer-contact-wrapper">
      <Typography className={styles.title} component="strong">
        {Messages.title}
      </Typography>
      <div className={styles.nameWrapper}>
        <PersonOutlineOutlinedIcon />
        <Typography data-testid="customer-contact-name" className={styles.name}>
          {name}
        </Typography>
        <IconButton
          data-testid="customer-contact-email-icon"
          className={styles.icon}
          title={email}
          name="envelope"
          onClick={copyToClipboard}
          size="small"
          disabled={!email}
        >
          <EmailOutlinedIcon />
        </IconButton>
      </div>
    </div>
  );
};
