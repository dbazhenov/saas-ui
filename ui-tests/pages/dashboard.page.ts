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
  // Labels
  addOrganizationLabel = 'Add Organization';

  // Components
  entitlementsModal = new EntitlementsModal(this.page);
  ticketTable = new TicketsTable(this.page);
  contacts = new Contacts(this.page);
  gettingStarted = new GettingStarted(this.page);
  ticketOverview = new TicketOverview(this.page);
  accountSection = new AccountSection(this.page);

  // Elements
  viewOrgLink = this.page.locator('span', { hasText: 'View Organization' });
  ticketSection = this.page.locator('//*[@data-testid="dashboard-ticket-section"]');
  openNewTicketButton = this.page.locator('a', { has: this.page.locator('text="Open new ticket"') });
  gettingStartedContainer = this.page.locator('//div[@data-testid="getting-started-container"]');
  addOrganizationLocator = this.page.locator('a', { hasText: this.addOrganizationLabel });

  // Messages
  emailCopiedClipboard = 'Email copied to clipboard';

  // Links
  serviceNowAddress = 'https://perconadev.service-now.com/percona';

  verifyOpenNewTicketButton = async () => {
    await expect(this.openNewTicketButton).toHaveAttribute('href', this.serviceNowAddress);
    await expect(this.openNewTicketButton).toHaveAttribute('target', '_blank');
  }
}
