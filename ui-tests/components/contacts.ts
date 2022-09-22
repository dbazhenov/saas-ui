/* eslint-disable lines-between-class-members */
import { Locator, Page } from '@playwright/test';

export default class Contacts {
  readonly page: Page;

  readonly contactsHelpEmail: string;
  readonly contactsHelpEmailCustomer: string;
  readonly contactsHelpForums: string;
  readonly contactsHelpDiscord: string;
  readonly contactPageLabel: string;

  readonly emailClipboardMessage: string;

  readonly mailtoPerconaHelpEmail: string;
  readonly contactsHelpForumsLink: string;
  readonly contactsHelpDiscordLink: string;
  readonly contactPageLinkAddress: string;

  readonly accountLoadingSpinner: Locator;
  readonly contactsLoadingSpinner: Locator;
  readonly perconaContactsHeader: Locator;
  readonly emailContactLink: Locator;
  readonly forumContactLink: Locator;
  readonly discordContactLink: Locator;
  readonly contactPageLink: Locator;
  readonly customerContactIcon: Locator;
  readonly customerContactName: Locator;

  constructor(page: Page) {
    this.page = page;

    this.contactsHelpEmail = 'portal-help@percona.com';
    this.contactsHelpEmailCustomer = 'customercare@percona.com';
    this.contactsHelpForums = 'Forums';
    this.contactsHelpDiscord = 'Discord';
    this.contactPageLabel = 'Contacts page';

    this.emailClipboardMessage = 'Email copied to clipboard';

    this.mailtoPerconaHelpEmail = 'mailto:portal-help@percona.com';
    this.contactsHelpForumsLink = 'https://forums.percona.com';
    this.contactsHelpDiscordLink = 'http://per.co.na/discord';
    this.contactPageLinkAddress = 'https://www.percona.com/about-percona/contact';

    this.accountLoadingSpinner = page.locator(
      '//div[@data-testid="account-section"]//div[@data-testid="overlay-spinner"]',
    );
    this.contactsLoadingSpinner = page.locator(
      '//div[@data-testid="contacts-section"]//div[data-testid="overlay-spinner"]',
    );
    this.perconaContactsHeader = page.locator('p', { hasText: 'Percona Contacts' });
    this.emailContactLink = page.locator('//a[@data-testid="email-contact-link"]');
    this.forumContactLink = page.locator('//a[@data-testid="forum-contact-link"]');
    this.discordContactLink = page.locator('//a[@data-testid="discord-contact-link"]');
    this.contactPageLink = page.locator('//a[@data-testid="contact-page-link"]');
    this.customerContactIcon = page.locator('//button[@data-testid="customer-contact-email-icon"]//div');
    this.customerContactName = page.locator('//span[@data-testid="customer-contact-name"]');
  }
}
