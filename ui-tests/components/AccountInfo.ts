/* eslint-disable lines-between-class-members */
import { Page } from '@playwright/test';
import { CommonPage } from '@tests/pages/common.page';

export default class AccountSection extends CommonPage {
  constructor(page: Page) {
    super(page);
  }

  messages = {};

  elements = {
    userRole: this.page.locator('//p[@data-testid="account-info-user-role"]'),
  };

  fields = {};

  buttons = {};
}
