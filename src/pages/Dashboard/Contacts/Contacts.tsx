import React, { FC, useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IconButton, LinkButton, useStyles } from '@grafana/ui';
import { Overlay } from '@percona/platform-core';
import { getAuth, getUserOrgRole, getIsPerconaCustomer } from 'store/auth';
import {
  getCustomerSuccessContact,
  getEntitlementsAction,
  getFirstOrgId,
  getIsOrgPending,
  getOrganizationAction,
  getOrgEntitlements,
  getCurrentOrgName,
  searchOrgsAction,
  getUserRoleAction,
} from 'store/orgs';
import { getStyles } from './Contacts.styles';
import { Messages } from './Contacts.messages';
import { HELP_EMAIL, LINKS } from './Contacts.constants';
import { CustomerContact } from './CustomerContact/CustomerContact';
import { getAccountType } from './Contacts.utils';
import { EntitlementsModal } from './EntitlementsModal/EntitlementsModal';

export const Contacts: FC = () => {
  const styles = useStyles(getStyles);
  const orgId = useSelector(getFirstOrgId);
  const orgName = useSelector(getCurrentOrgName);
  const dispatch = useDispatch();
  const isCustomer = useSelector(getIsPerconaCustomer);
  const isOrgPending = useSelector(getIsOrgPending);
  const CSContact = useSelector(getCustomerSuccessContact);
  const entitlements = useSelector(getOrgEntitlements);
  const [isEntitlementsVisible, setIsEntilementsVisible] = useState(false);
  const user = useSelector(getAuth);
  const role = useSelector(getUserOrgRole);
  const { firstName, lastName, pending: isUserPending } = user;
  const isPending = isUserPending || isOrgPending;

  const viewEntitlements = useCallback(
    (isVisible: boolean) => () => {
      setIsEntilementsVisible(isVisible);
    },
    [setIsEntilementsVisible],
  );

  useEffect(() => {
    if (!orgId) {
      dispatch(searchOrgsAction());
    }
  }, [dispatch, orgId]);

  useEffect(() => {
    dispatch(getUserRoleAction());
  }, [dispatch]);

  useEffect(() => {
    if (orgId) {
      if (!orgName) {
        dispatch(getOrganizationAction(orgId));
      }

      if (!entitlements.length) {
        dispatch(getEntitlementsAction(orgId));
      }
    }
  }, [dispatch, orgId, orgName, entitlements.length]);

  return (
    <section className={styles.cardsContainer}>
      <div className={styles.card}>
        <Overlay className={styles.cardOverlay} isPending={isPending}>
          <p className={styles.cardTitle}>{Messages.yourAccount}</p>
          <p>
            <span className={styles.cardPoint}>{Messages.name}</span> {firstName} {lastName}
          </p>
          {role && (
            <p>
              <span className={styles.cardPoint}>{Messages.role}</span> {role}
            </p>
          )}
          <p>
            <span className={styles.cardPoint}>{Messages.accountType}</span>
            &nbsp;
            {getAccountType(isCustomer, !!CSContact.name, isPending)}
          </p>
          {!isPending && !isCustomer && (
            <>
              <p>{Messages.perconaExperts}</p>
              <LinkButton
                target="_blank"
                rel="noreferrer noopener"
                className={styles.contactBtn}
                variant="primary"
                href={LINKS.contactUs}
              >
                {Messages.contactUs}
              </LinkButton>
            </>
          )}
          {isCustomer && (
            <p className={styles.entitlementsWrapper}>
              <span className={styles.cardPoint}>{Messages.entitlements}</span>
              &nbsp;
              {entitlements.length}
              {entitlements.length ? (
                <IconButton
                  name="list-ul"
                  size="lg"
                  className={styles.icon}
                  onClick={viewEntitlements(true)}
                />
              ) : null}
            </p>
          )}
        </Overlay>
      </div>
      <div className={styles.card}>
        <Overlay className={styles.cardOverlay} isPending={isOrgPending}>
          <p className={styles.cardTitle}>{Messages.perconaContacts}</p>
          <p>
            <span className={styles.label}>{Messages.needHelp}</span>
            <a className={styles.externalLink} href={`mailto:${HELP_EMAIL}`} data-testid="email-contact-link">
              {HELP_EMAIL}
            </a>
          </p>
          {CSContact.name ? (
            <CustomerContact />
          ) : (
            <>
              <p>{Messages.findUs}</p>
              <p>
                <a
                  className={styles.externalLink}
                  href={LINKS.forum}
                  target="_blank"
                  rel="noreferrer noopener"
                  data-testid="forum-contact-link"
                >
                  {Messages.forums}
                </a>
              </p>
              <p>
                <a
                  className={styles.externalLink}
                  href={LINKS.discord}
                  target="_blank"
                  rel="noreferrer noopener"
                  data-testid="discord-contact-link"
                >
                  {Messages.discord}
                </a>
              </p>
              <p>
                {Messages.getInTouch}{' '}
                <a
                  className={styles.externalLink}
                  href={LINKS.contact}
                  target="_blank"
                  rel="noreferrer noopener"
                  data-testid="contact-page-link"
                >
                  {Messages.contactsPage}
                </a>
              </p>
            </>
          )}
        </Overlay>
      </div>
      {isEntitlementsVisible && (
        <EntitlementsModal entitlements={entitlements} onClose={viewEntitlements(false)} />
      )}
    </section>
  );
};
