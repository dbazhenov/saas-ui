import { expect, Page } from '@playwright/test';
import AccountSection from '@tests/components/AccountInfo';
import Contacts from '@tests/components/contacts';
import EntitlementsModal from '@tests/components/entitlementsModal';
import GettingStarted from '@tests/components/gettingStarted';
import { TicketOverview } from '@tests/components/ticketOverview';
import { TicketsTable } from '@tests/components/ticketsTable';
import { CommonPage } from './common.page';

export class DashboardPage extends CommonPage {
  constructor(page: Page) {
    super(page);
  }

  entitlementsModal = new EntitlementsModal(this.page);
  ticketTable = new TicketsTable(this.page);
  contacts = new Contacts(this.page);
  gettingStarted = new GettingStarted(this.page);
  ticketOverview = new TicketOverview(this.page);
  accountSection = new AccountSection(this.page);

  elements = {
    viewOrgLink: this.page.locator('span', { hasText: 'View Organization' }),
    ticketSection: this.page.getByTestId('dashboard-ticket-section'),
    gettingStartedContainer: this.page.getByTestId('getting-started-container'),
    addOrganizationLocator: this.page.getByText('Add Organization'),
    advisorsWidget: this.page.getByTestId('advisors-widget'),
  };

  fields = {};

  labels = {
    installPMMTitle: 'Installing Percona Monitoring and Management (PMM) Software - Percona',
  };

  buttons = {
    openNewTicket: this.page.getByText('Open new ticket'),
    advisorsButton: this.page.getByTestId('advisors-button'),
  };

  messages = {
    emailCopiedClipboard: 'Email copied to clipboard',
  };

  links = {
    serviceNow: 'https://perconadev.service-now.com/percona',
  };

  verifyOpenNewTicketButton = async () => {
    await expect(this.buttons.openNewTicket).toHaveAttribute('href', this.links.serviceNow);
    await expect(this.buttons.openNewTicket).toHaveAttribute('target', '_blank');
  };
}
