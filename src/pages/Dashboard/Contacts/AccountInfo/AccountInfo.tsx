import React, { FC, useEffect, useState } from 'react';
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
import { getStyles } from './AccountInfo.styles';
import { Messages } from './AccountInfo.messages';
import { LINKS } from './AccountInfo.constants';
import { getAccountType } from '../Contacts.utils';
import { EntitlementsModal } from '../EntitlementsModal/EntitlementsModal';

export const AccountInfo: FC = () => {
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
    <>
      <section className={styles.cardsContainer}>
        <div className={styles.card} data-testid="account-section">
          <Overlay className={styles.cardOverlay}>
            <p className={styles.cardTitle}>{Messages.yourAccount}</p>
            <p>
              <span className={styles.cardPoint}>{Messages.name}</span> {firstName} {lastName}
            </p>
            {role && (
              <p data-testid="account-info-user-role">
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
              <p className={styles.entitlementsWrapper} data-testid="entitlements-row">
                <span className={styles.cardPoint}>{Messages.entitlements}</span>
                &nbsp;
                <span data-testid="number-entitlements">{entitlements.length}</span>
                {entitlements.length ? (
                  <IconButton
                    name="list-ul"
                    size="lg"
                    className={styles.icon}
                    onClick={() => setIsEntilementsVisible(true)}
                    data-testid="entitlements-button"
                  />
                ) : null}
              </p>
            )}
          </Overlay>
        </div>
        {isEntitlementsVisible && (
          <EntitlementsModal entitlements={entitlements} onClose={() => setIsEntilementsVisible(false)} />
        )}
      </section>
    </>
  );
};
