import React, { FC, useState, useEffect } from 'react';
import { useStyles } from '@grafana/ui';
import useFetch from 'use-http';
import { PrivateLayout } from 'components/Layouts';
import { getUseHttpConfig } from 'core/api/api.service';
import { ENDPOINTS } from 'core/api';
import { getStyles } from './Dashboard.styles';
import { Contacts } from './Contacts';
import { TicketList } from './TicketList';
import { Messages } from './Dashboard.messages';

const { Org } = ENDPOINTS;

export const DashboardPage: FC = () => {
  const styles = useStyles(getStyles);
  const [hasCompany, setHasCompany] = useState(false);
  const { post } = useFetch(...getUseHttpConfig());

  useEffect(() => {
    const getUserCompany = async () => {
      const { name } = await post(Org.getUserCompany);

      if (name) {
        setHasCompany(true);
      }
    };

    getUserCompany();
  }, [post]);

  return (
    <PrivateLayout>
      <div className={styles.container} data-testid="dashboard-container">
        <Contacts />
        {hasCompany && (
          <section className={styles.ticketSection} data-testid="dashboard-ticket-section">
            <h4 className={styles.ticketSectionTitle}>{Messages.listOfTickets}</h4>
            <TicketList />
          </section>
        )}
      </div>
    </PrivateLayout>
  );
};
