import { Locator, Page } from '@playwright/test';

export class ServiceNowPage {
  constructor(readonly page: Page) {}

  loginWithPercona: Locator = this.page.locator('//button[@ng-click="c.perconaAccountExternalLogin()"]');
  createTicket: Locator = this.page.getByText('Contact our Customer Success team for help');

  loggedInTitle = 'Percona Service Portal - Percona Customer Portal';
}
