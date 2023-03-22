import React, { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useStyles } from 'core';
import { Card, Typography } from '@mui/material';
import { getIsPerconaCustomer } from 'store/auth';
import {
  getCustomerSuccessContact,
  getEntitlementsAction,
  getFirstOrgId,
  getOrgEntitlements,
  getCurrentOrgName,
  searchOrgsAction,
  getUserRoleAction,
  getOrganizationAction,
} from 'store/orgs';
import { getStyles } from './Contacts.styles';
import { Messages } from './Contacts.messages';
import { FREE_USER_HELP_EMAIL, CUSTOMER_HELP_EMAIL, LINKS } from './Contacts.constants';
import { CustomerContact } from './CustomerContact/CustomerContact';

export const Contacts: FC = () => {
  const styles = useStyles(getStyles);
  const orgId = useSelector(getFirstOrgId);
  const orgName = useSelector(getCurrentOrgName);
  const dispatch = useDispatch();
  const isCustomer = useSelector(getIsPerconaCustomer);
  const CSContact = useSelector(getCustomerSuccessContact);
  const entitlements = useSelector(getOrgEntitlements);
  const helpEmail = isCustomer ? CUSTOMER_HELP_EMAIL : FREE_USER_HELP_EMAIL;

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
    <Card className={styles.cardsContainer}>
      <div className={styles.card} data-testid="contacts-section">
        <Typography className={styles.cardTitle} variant="h6">
          {Messages.perconaContacts}
        </Typography>
        <div className={styles.needHelp}>
          <Typography>{Messages.needHelp}</Typography>
          <a className={styles.externalLink} href={`mailto:${helpEmail}`} data-testid="email-contact-link">
            {helpEmail}
          </a>
        </div>
        {CSContact.name ? (
          <CustomerContact />
        ) : (
          <div>
            <Typography>{Messages.findUs}</Typography>
            <a
              className={styles.externalLink}
              href={LINKS.forum}
              target="_blank"
              rel="noreferrer noopener"
              data-testid="forum-contact-link"
            >
              {Messages.forums}
            </a>
            <a
              className={styles.externalLink}
              href={LINKS.discord}
              target="_blank"
              rel="noreferrer noopener"
              data-testid="discord-contact-link"
            >
              {Messages.discord}
            </a>
            <p>
              <Typography component="span">{Messages.getInTouch} </Typography>
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
          </div>
        )}
      </div>
    </Card>
  );
};
