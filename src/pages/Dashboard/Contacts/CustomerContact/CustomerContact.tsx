import React, { FC, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Icon, IconButton, useStyles } from '@grafana/ui';
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
      <span className={styles.title}>{Messages.title}</span>
      <div className={styles.nameWrapper}>
        <Icon name="user" size="lg" />
        <span data-testid="customer-contact-name" className={styles.name}>
          {name}
        </span>
        <IconButton
          data-testid="customer-contact-email-icon"
          className={styles.icon}
          title={email}
          name="envelope"
          onClick={copyToClipboard}
          size="lg"
          disabled={!email}
        />
      </div>
    </div>
  );
};
