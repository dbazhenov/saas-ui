import React, { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LinkButton, useStyles } from '@grafana/ui';
import { PrivateLayout } from 'components/Layouts';
import { GettingStarted } from 'components';
import { getUserCompanyAction, getUserCompanyName } from 'store/auth';
import { getCurrentOrgName, getFirstOrgId, getOrgs, getOrgInventory, getInventoryAction, getOrganizationAction, getServiceNowOrganizationAction, getTicketUrl, getIsOrgPending } from 'store/orgs';
import { getStyles } from './Dashboard.styles';
import { Contacts } from './Contacts';
import { TicketList } from './TicketList';
import { Messages } from './Dashboard.messages';

export const DashboardPage: FC = () => {
  const styles = useStyles(getStyles);
  const dispatch = useDispatch();
  const orgs = useSelector(getOrgs);
  const inventory = useSelector(getOrgInventory);
  const companyName = useSelector(getUserCompanyName);
  const orgId = useSelector(getFirstOrgId);
  const isPending = useSelector(getIsOrgPending);
  const currentOrgName = useSelector(getCurrentOrgName);
  const newTicketUrl = useSelector(getTicketUrl);
  const [showGettingStarted, setShowGettingStarted] = useState<boolean>();

  useEffect(() => {
    if (!companyName) {
      dispatch(getUserCompanyAction());
    }
  }, [dispatch, companyName]);

  useEffect(() => {
    if (orgId && !currentOrgName) {
      dispatch(getOrganizationAction(orgId));
    }
  }, [dispatch, orgId, currentOrgName]);

  useEffect(() => {
    // if there are no orgs check for a linked company in ServiceNow
    // and add the org to orgd with the name of the company found in ServiceNow
    if (!orgs.length && !orgId && companyName) {
      dispatch(getServiceNowOrganizationAction(companyName));
    }
  }, [dispatch, orgId, orgs.length, companyName]);

  useEffect(() => {
    if (inventory == null && orgId) {
      dispatch(getInventoryAction(orgId));
    }
  }, [dispatch, inventory, orgId]);

  useEffect(() => {
    setShowGettingStarted((!(companyName || orgId) || !inventory?.length) && !isPending);
  }, [orgId, companyName, inventory?.length, isPending]);

  return (
    <PrivateLayout>
      <div className={styles.container} data-testid="dashboard-container">
        {showGettingStarted && <GettingStarted />}
        <Contacts />
        {companyName && orgId && (
          <section className={styles.ticketSection} data-testid="dashboard-ticket-section">
            <header className={styles.ticketListHeader}>
              <h4 className={styles.ticketSectionTitle}>{Messages.listOfTickets}</h4>
              <LinkButton
                target="_blank"
                rel="noreferrer noopener"
                className={styles.newTicketButton}
                variant="primary"
                href={newTicketUrl}
              >
                {Messages.openNewTicket}
              </LinkButton>
            </header>
            <TicketList />
          </section>
        )}
      </div>
    </PrivateLayout>
  );
};
