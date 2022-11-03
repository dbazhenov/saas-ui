/* eslint-disable lines-between-class-members */
import { expect, Locator, Page } from '@playwright/test';
import AccountSection from '@tests/components/AccountInfo';
import Contacts from '@tests/components/contacts';
import EntitlementsModal from '@tests/components/entitlementsModal';
import GettingStarted from '@tests/components/gettingStarted';
import { TicketOverview } from '@tests/components/ticketOverview';
import { TicketsTable } from '@tests/components/ticketsTable';
import { CommonPage } from './common.page';

interface Messages {
  readonly emailCopiedClipboard: string;
}

interface Labels {
  readonly addOrganizationLabel: string;
}

interface Links {
  readonly serviceNowAddress: string;
}

interface Locators {
  readonly viewOrgLink: Locator;
  readonly ticketSection: Locator;
  readonly openNewTicketButton: Locator;
  readonly gettingStartedContainer: Locator;
  readonly addOrganizationLocator: Locator;
}

export class DashboardPage extends CommonPage {
  readonly page: Page;

  readonly messages: Messages;
  readonly labels: Labels;
  readonly links: Links;
  readonly locators: Locators;

  readonly entitlementsModal: EntitlementsModal;
  readonly ticketTable: TicketsTable;
  readonly contacts: Contacts;
  readonly gettingStarted: GettingStarted;
  readonly ticketOverview: TicketOverview;
  readonly accountSection: AccountSection;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.messages = {
      emailCopiedClipboard: 'Email copied to clipboard',
    };
    this.labels = {
      addOrganizationLabel: 'Add Organization',
    };
    this.links = {
      serviceNowAddress: 'https://perconadev.service-now.com/percona',
    };
    this.locators = {
      viewOrgLink: page.locator('span', { hasText: 'View Organization' }),
      ticketSection: page.locator('//*[@data-testid="dashboard-ticket-section"]'),
      openNewTicketButton: page.locator('a', { has: page.locator('text="Open new ticket"') }),
      gettingStartedContainer: page.locator('//div[@data-testid="getting-started-container"]'),
      addOrganizationLocator: page.locator('a', { hasText: this.labels.addOrganizationLabel }),
    };
    this.entitlementsModal = new EntitlementsModal(page);
    this.ticketTable = new TicketsTable(page);
    this.contacts = new Contacts(page);
    this.gettingStarted = new GettingStarted(page);
    this.ticketOverview = new TicketOverview(page);
    this.accountSection = new AccountSection(page);
  }

  async verifyOpenNewTicketButton() {
    const hrefLinkAttribute = await this.locators.openNewTicketButton.getAttribute('href');

    expect(hrefLinkAttribute).toEqual(this.links.serviceNowAddress);
    const targetLinkAttribute = await this.locators.openNewTicketButton.getAttribute('target');

    expect(targetLinkAttribute).toEqual('_blank');
  }
}
