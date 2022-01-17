import React, { FC, useState, useEffect } from 'react';
import { useStyles, LinkButton } from '@grafana/ui';
import useFetch from 'use-http';
import { PrivateLayout } from 'components/Layouts';
import { getUseHttpConfig } from 'core/api/api.service';
import { ENDPOINTS } from 'core/api';
import { GetOrganizationResponse } from 'core/api/types';
import { getStyles } from './Dashboard.styles';
import { Contacts } from './Contacts';
import { TicketList } from './TicketList';
import { Messages } from './Dashboard.messages';

const { Org } = ENDPOINTS;

export const DashboardPage: FC = () => {
  const styles = useStyles(getStyles);
  const [hasCompany, setHasCompany] = useState(false);
  const [orgId, setOrgId] = useState<string>();
  const [newTicketUrl, setNewTicketUrl] = useState<string>();
  const { get, post } = useFetch(...getUseHttpConfig());

  useEffect(() => {
    const getUserCompany = async () => {
      const { name } = await post(Org.getUserCompany);

      if (name) {
        setHasCompany(true);
      }
    };

    const getUserOrganization = async () => {
      const { orgs } = await post(Org.getUserOganizations);

      if (orgs && orgs.length) {
        setOrgId(orgs[0].id);
      }
    };

    getUserCompany();
    getUserOrganization();
  }, [post]);

  useEffect(() => {
    const getNewTicketUrl = async () => {
      const { contacts: {
        new_ticket_url: url,
      } }: GetOrganizationResponse = await get(`${Org.getOrganization}/${orgId}`);

      if (url) {
        setNewTicketUrl(url);
      }
    };

    if (hasCompany && orgId) {
      getNewTicketUrl();
    }
  }, [get, hasCompany, orgId]);

  return (
    <PrivateLayout>
      <div className={styles.container} data-testid="dashboard-container">
        <Contacts />
        {hasCompany && (
          <section className={styles.ticketSection} data-testid="dashboard-ticket-section">
            <header className={styles.ticketListHeader}>
              <h4 className={styles.ticketSectionTitle}>{Messages.listOfTickets}</h4>
              <LinkButton target="_blank" rel="noreferrer" className={styles.newTicketButton} variant="primary" href={newTicketUrl}>{Messages.openNewTicket}</LinkButton>
            </header>
            <TicketList />
          </section>
        )}
      </div>
    </PrivateLayout>
  );
};
