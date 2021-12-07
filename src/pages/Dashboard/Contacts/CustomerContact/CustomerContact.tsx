import React, { FC, useCallback } from 'react';
import { toast } from 'react-toastify'; 
import { openNewTab } from 'core';
import { Icon, IconButton, useStyles } from '@grafana/ui';
import { getStyles } from './CustomerContact.styles';
import { CustomerContactProps } from './CustomerContact.types';
import { Messages } from './CustomerContact.messages';

export const CustomerContact: FC<CustomerContactProps> = ({
  name,
  email,
  ticketUrl,
}) => {
  const styles = useStyles(getStyles);
  const createTicket = useCallback(() => {
    openNewTab(ticketUrl);
  }, [ticketUrl]);
  const copyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(email);
    toast.success(Messages.copiedSuccessfully);
  }, [email]);

  return (
    <div className={styles.wrapper} data-testid="customer-contact-wrapper">
      <span className={styles.title}>{Messages.title}</span>
      <div className={styles.nameWrapper}>
        <Icon name="user" size="lg" />
        <span data-testid="customer-contact-name" className={styles.name}>{name}</span>
        <IconButton
          data-testid="customer-contact-ticket-icon"
          className={styles.icon}
          title={Messages.ticket}
          name="bug"
          onClick={createTicket}
          size="lg"
        />
        <IconButton
          data-testid="customer-contact-email-icon"
          className={styles.icon}
          title={email}
          name="envelope"
          onClick={copyToClipboard}
          size="lg"
        />
      </div>
    </div>
  );
};
