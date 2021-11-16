import React, { FC } from 'react';
import { LinkButton, useStyles } from '@grafana/ui';
import { useUserInfo, useUserRole } from 'core/hooks';
import { Overlay } from '@percona/platform-core';
import { getStyles } from './Contacts.styles';
import { Messages } from './Contacts.messages';
import { LINKS } from './Contacts.constants';

export const Contacts: FC = () => {
  const styles = useStyles(getStyles);
  const [user] = useUserInfo();
  const [role, rolePending] = useUserRole();
  const { firstName, lastName, pending: userPending } = user;

  return (
    <div className={styles.cardsContainer}>
      <div className={styles.card}>
        <Overlay className={styles.cardOverlay} isPending={userPending || rolePending}>
          <p className={styles.cardTitle}>{Messages.yourAccount}</p>
          <p>
            <span className={styles.cardPoint}>{Messages.name}</span> {firstName} {lastName}
          </p>
          {role && <p>
            <span className={styles.cardPoint}>{Messages.role}</span> {role}
          </p>}
          <p>
            <span className={styles.cardPoint}>{Messages.accountType}</span> {Messages.freeAccount}
          </p>
          <p>{Messages.perconaExperts}</p>
          <LinkButton target="_blank" rel="noreferrer" className={styles.contactBtn} variant="primary" href={LINKS.contactUs}>{Messages.contactUs}</LinkButton>
        </Overlay>
      </div>
      <div className={styles.card}>
      <Overlay className={styles.cardOverlay}>
        <p className={styles.cardTitle}>{Messages.perconaContacts}</p>
        <p>{Messages.findUs}</p>
        <p><a className={styles.externalLink} href={LINKS.forum} target="_blank" rel="noreferrer">{Messages.forums}</a></p>
        <p><a className={styles.externalLink} href={LINKS.discord} target="_blank" rel="noreferrer">{Messages.discord}</a></p>
        <p>
          {Messages.getInTouch} <a className={styles.externalLink} href={LINKS.contact} target="_blank" rel="noreferrer">{Messages.contactsPage}</a>
        </p>
      </Overlay>
      </div>
    </div>
  );
};
