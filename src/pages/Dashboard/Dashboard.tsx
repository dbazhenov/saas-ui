import React, { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LinkButton, useStyles } from '@grafana/ui';
import { PrivateLayout } from 'components/Layouts';
import { getUserCompanyAction, getUserCompanyName } from 'store/auth';
import { getCurrentOrgName, getFirstOrgId, getOrganizationAction, getTicketUrl } from 'store/orgs';
import { getStyles } from './Dashboard.styles';
import { Contacts } from './Contacts';
import { TicketList } from './TicketList';
import { Messages } from './Dashboard.messages';

export const DashboardPage: FC = () => {
  const styles = useStyles(getStyles);
  const dispatch = useDispatch();
  const companyName = useSelector(getUserCompanyName);
  const orgId = useSelector(getFirstOrgId);
  const currentOrgName = useSelector(getCurrentOrgName);
   const newTicketUrl = useSelector(getTicketUrl);

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

  return (
    <PrivateLayout>
      <div className={styles.container} data-testid="dashboard-container">
        <Contacts />
        {companyName && (
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
