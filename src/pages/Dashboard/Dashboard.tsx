import React, { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useStyles } from 'core';
import { Button, Typography } from '@mui/material';
import { PrivateLayout } from 'components/Layouts';
import { GettingStarted } from 'components';
import { getUserCompanyAction, getUserCompanyName } from 'store/auth';
import { DashBoardContentLoader } from 'components/ContentLoader/DashboardContentLoader';
import {
  getCurrentOrgName,
  getFirstOrgId,
  getOrgs,
  getOrgInventory,
  getInventoryAction,
  getOrganizationAction,
  getTicketUrl,
  getIsOrgPending,
  getOrgTicketsAction,
  createServiceNowOrganizationAction,
  setOrgTicketsLoadingAction,
  getOrgTickets,
  getOrgTicketsPending,
} from 'store/orgs';
import { SupportTicketOverview } from 'components/SupportTicketOverview/SupportTicketOverview';
import { getStyles } from './Dashboard.styles';
import { Contacts } from './Contacts';
import { TicketList } from './TicketList';
import { Messages } from './Dashboard.messages';
import { AccountInfo } from './Contacts/AccountInfo';
import { AdvisorsInfo } from './AdvisorsInfo/AdvisorsInfo';

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
  const [showGettingStarted, setShowGettingStarted] = useState<boolean>(false);
  const tickets = useSelector(getOrgTickets);
  const isLoadingTickets = useSelector(getOrgTicketsPending);

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
      dispatch(createServiceNowOrganizationAction(companyName));
    }
  }, [dispatch, orgId, orgs.length, companyName]);

  useEffect(() => {
    if (inventory == null && orgId) {
      dispatch(getInventoryAction(orgId));
    }
  }, [dispatch, inventory, orgId]);

  useEffect(() => {
    if (orgId) {
      dispatch(getOrgTicketsAction());
    } else {
      dispatch(setOrgTicketsLoadingAction(false));
    }
  }, [dispatch, orgId]);

  useEffect(() => {
    setShowGettingStarted(
      (!(companyName || orgId) || !inventory?.length) && !isPending && !isLoadingTickets && !tickets?.length,
    );
  }, [orgId, companyName, inventory?.length, isPending, isLoadingTickets, tickets?.length]);

  return (
    <PrivateLayout>
      <div className={styles.container} data-testid="dashboard-container">
        {isLoadingTickets ? (
          <DashBoardContentLoader />
        ) : (
          <>
            <div className={styles.widgets}>
              <div className={styles.cardsWrapper}>
                <Contacts />
                <AccountInfo />
              </div>
              <AdvisorsInfo />
            </div>
            {showGettingStarted ? <GettingStarted /> : <></>}
            <SupportTicketOverview />
            {companyName && orgId && (
              <section className={styles.ticketSection} data-testid="dashboard-ticket-section">
                <header className={styles.ticketListHeader}>
                  <Typography className={styles.ticketSectionTitle} variant="h6">
                    {Messages.listOfTickets}
                  </Typography>
                  <Button
                    target="_blank"
                    rel="noreferrer noopener"
                    className={styles.newTicketButton}
                    variant="contained"
                    href={newTicketUrl}
                  >
                    {Messages.openNewTicket}
                  </Button>
                </header>
                <TicketList />
              </section>
            )}
          </>
        )}
      </div>
    </PrivateLayout>
  );
};
