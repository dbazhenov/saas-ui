import React, { FC, useEffect, useState, useCallback } from 'react';
import useFetch from 'use-http';
import { toast } from 'react-toastify';
import { IconButton, LinkButton, useStyles } from '@grafana/ui';
import { ENDPOINTS } from 'core/api';
import { useUserInfo, useUserRole } from 'core/hooks';
import { GetOrganizationResponse, OrganizationEntitlement, SearchOrganizationEntitlementsResponse } from 'core/api/types';
import { getUseHttpConfig } from 'core/api/api.service';
import { Overlay } from '@percona/platform-core';
import { getStyles } from './Contacts.styles';
import { Messages } from './Contacts.messages';
import { HELP_EMAIL, LINKS } from './Contacts.constants';
import { CustomerContact } from './CustomerContact/CustomerContact';
import { SuccessManager } from './Contacts.types';
import { getAccountType } from './Contacts.utils';
import { EntitlementsModal } from './EntitlementsModal/EntitlementsModal';

const { Org } = ENDPOINTS;

export const Contacts: FC = () => {
  const styles = useStyles(getStyles);
  const [orgId, setOrgId] = useState<string>();
  const [sucessManager, setSuccessManager] = useState<SuccessManager>();
  const [isCustomer, setIsCustomer] = useState(false);
  const [entitlements, setEntitlements] = useState<OrganizationEntitlement[]>([]);
  const [isEntitlementsVisible, setIsEntilementsVisible] = useState(false);
  const [user] = useUserInfo();
  const [role, rolePending] = useUserRole();
  const fetchConfig = getUseHttpConfig();
  const { error, loading, post, get } = useFetch(...fetchConfig);
  const {
    loading: loadingCompany,
    post: postUserCompany,
  } = useFetch(...getUseHttpConfig(undefined, { loading }));
  const { loading: loadingEntitlements, post: postEntitlements } = useFetch(...fetchConfig);
  const { firstName, lastName, pending: userPending } = user;
  const isPending = userPending || rolePending || loading || loadingCompany || loadingEntitlements;
  const getUserCompany = useCallback(async() => {
    const { name } = await postUserCompany(Org.getUserCompany);

    if (name) {
      setIsCustomer(true);
    }

  }, [postUserCompany]);
  const viewEntitlements = useCallback((isVisible: boolean) => () => {
    setIsEntilementsVisible(isVisible);
  }, [setIsEntilementsVisible]);

  useEffect(() => {
    const getOrgs = async () => {
      const { orgs } = await post(Org.getUserOganizations);

      if (orgs && orgs.length) {
        setOrgId(orgs[0].id);
      }
    };

    getOrgs();
    getUserCompany();
  }, [post, getUserCompany]);

  useEffect(() => {
    const getOrg = async () => {
      const { contacts: {
        customer_success: { email, name },
      } }: GetOrganizationResponse = await get(`${Org.getOrganization}/${orgId}`);

      if (email && name) {
        setSuccessManager({
          email,
          name,
        });
      }
    };

    const getEntitlements = async () => {
      const {
        entitlements: entitlementsResponse,
      }: SearchOrganizationEntitlementsResponse = await postEntitlements(Org.searchOrgEntitlements(orgId!));

      if (entitlementsResponse) {
        setEntitlements(entitlementsResponse);
      }
    };

    if (orgId) {
      getOrg();
      getEntitlements();
    }
  }, [orgId, get, postEntitlements]);

  useEffect(() => {
    if (error) {
      toast.error(Messages.fetchContactsError);
    }
  }, [error]);

  return (
    <div className={styles.cardsContainer}>
      <div className={styles.card}>
        <Overlay
          className={styles.cardOverlay}
          isPending={isPending}
        >
          <p className={styles.cardTitle}>{Messages.yourAccount}</p>
          <p>
            <span className={styles.cardPoint}>{Messages.name}</span> {firstName} {lastName}
          </p>
          {role && <p>
            <span className={styles.cardPoint}>{Messages.role}</span> {role}
          </p>}
          <p>
            <span className={styles.cardPoint}>{Messages.accountType}</span>
            &nbsp;
            {getAccountType(isCustomer, !!sucessManager, isPending)}
          </p>
          {!isPending && !isCustomer && (
            <>
              <p>{Messages.perconaExperts}</p>
              <LinkButton target="_blank" rel="noreferrer" className={styles.contactBtn} variant="primary" href={LINKS.contactUs}>{Messages.contactUs}</LinkButton>
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
      <Overlay className={styles.cardOverlay} isPending={loading}>
        <p className={styles.cardTitle}>{Messages.perconaContacts}</p>
        <p>
          <span className={styles.label}>{Messages.needHelp}</span>
          <a className={styles.externalLink} href={`mailto:${HELP_EMAIL}`}>{HELP_EMAIL}</a>
        </p>
        {sucessManager ? (
          <CustomerContact
            name={sucessManager.name}
            email={sucessManager.email}
          />
        ) : (
          <>
            <p>{Messages.findUs}</p>
            <p><a className={styles.externalLink} href={LINKS.forum} target="_blank" rel="noreferrer">{Messages.forums}</a></p>
            <p><a className={styles.externalLink} href={LINKS.discord} target="_blank" rel="noreferrer">{Messages.discord}</a></p>
            <p>
              {Messages.getInTouch} <a className={styles.externalLink} href={LINKS.contact} target="_blank" rel="noreferrer">{Messages.contactsPage}</a>
            </p>
          </>
        )}
      </Overlay>
      </div>
      {isEntitlementsVisible && (
        <EntitlementsModal
          entitlements={entitlements}
          onClose={viewEntitlements(false)}
        />
      )}
    </div>
  );
};
