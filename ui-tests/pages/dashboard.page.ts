/* eslint-disable lines-between-class-members */
import { expect, Locator, Page } from '@playwright/test';
import { CommonPage } from './common.page';

interface Messages {
  readonly emailCopiedClipboard: string;
}

interface Labels {
  readonly contactsHelpEmail: string;
  readonly contactsHelpEmailCustomer: string;
  readonly contactsHelpForums: string;
  readonly contactsHelpDiscord: string;
  readonly contactPage: string;
  readonly addOrganizationLabel: string;
  readonly tableHeaders: string[];
}

interface Links {
  readonly serviceNowAddress: string;
  readonly contactsHelpForumsLink: string;
  readonly contactsHelpDiscordLink: string;
  readonly contactPageAddress: string;
}

interface Locators {
  readonly accountLoadingSpinner: Locator;
  readonly contactsLoadingSpinner: Locator;
  readonly viewOrgLink: Locator;
  readonly ticketSection: Locator;
  readonly ticketTable: Locator;
  readonly emptyTicketTable: Locator;
  readonly openNewTicketButton: Locator;
  readonly perconaContactsHeader: Locator;
  readonly emailContactLink: Locator;
  readonly forumContactLink: Locator;
  readonly discordContactLink: Locator;
  readonly contactPageLink: Locator;
  readonly gettingStartedContainer: Locator;
  readonly addOrganizationLocator: Locator;
  readonly customerContactIcon: Locator;
  readonly customerContactName: Locator;
  readonly tableHeaderCell: Locator;
  readonly ticketsTableBody: Locator;
}

export class DashboardPage extends CommonPage {
  readonly page: Page;

  readonly messages: Messages;
  readonly labels: Labels;
  readonly links: Links;
  readonly locators: Locators;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.messages = {
      emailCopiedClipboard: 'Email copied to clipboard',
    };
    this.labels = {
      contactsHelpEmail: 'portal-help@percona.com',
      contactsHelpEmailCustomer: 'customercare@percona.com',
      contactsHelpForums: 'Forums',
      contactsHelpDiscord: 'Discord',
      contactPage: 'Contacts page',
      addOrganizationLabel: 'Add Organization',
      tableHeaders: [
        'Number',
        'Status',
        'Short Description',
        'Category',
        'Priority',
        'Creation Date',
        'Requested By',
      ],
    };
    this.links = {
      serviceNowAddress: 'https://perconadev.service-now.com/percona',
      contactsHelpForumsLink: 'https://forums.percona.com',
      contactsHelpDiscordLink: 'http://per.co.na/discord',
      contactPageAddress: 'https://www.percona.com/about-percona/contact',
    };
    this.locators = {
      accountLoadingSpinner: page.locator(
        '//div[@data-testid="account-section"]//div[@data-testid="overlay-spinner"]',
      ),
      contactsLoadingSpinner: page.locator(
        '//div[@data-testid="contacts-section"]//div[data-testid="overlay-spinner"]',
      ),
      viewOrgLink: page.locator('span', { hasText: 'View Organization' }),
      ticketSection: page.locator('//*[@data-testid="dashboard-ticket-section"]'),
      ticketTable: page.locator('//table[@data-testid="table"]'),
      emptyTicketTable: page.locator('//div[@data-testid="table-no-data"]'),
      openNewTicketButton: page.locator('a', { has: page.locator('text="Open new ticket"') }),
      perconaContactsHeader: page.locator('p', { hasText: 'Percona Contacts' }),
      emailContactLink: page.locator('//a[@data-testid="email-contact-link"]'),
      forumContactLink: page.locator('//a[@data-testid="forum-contact-link"]'),
      discordContactLink: page.locator('//a[@data-testid="discord-contact-link"]'),
      contactPageLink: page.locator('//a[@data-testid="contact-page-link"]'),
      gettingStartedContainer: page.locator('//div[@data-testid="getting-started-container"]'),
      addOrganizationLocator: page.locator('a', { hasText: this.labels.addOrganizationLabel }),
      customerContactIcon: page.locator('//button[@data-testid="customer-contact-email-icon"]//div'),
      customerContactName: page.locator('//span[@data-testid="customer-contact-name"]'),
      tableHeaderCell: page.locator('//tr[@data-testid="table-thead-tr"]//th'),
      ticketsTableBody: page.locator('//tbody[@data-testid="table-tbody"]'),
    };
  }

  async verifyOpenNewTicketButton() {
    const hrefLinkAttribute = await this.locators.openNewTicketButton.getAttribute('href');

    expect(hrefLinkAttribute).toEqual(this.links.serviceNowAddress);
    const targetLinkAttribute = await this.locators.openNewTicketButton.getAttribute('target');

    expect(targetLinkAttribute).toEqual('_blank');
  }
}
