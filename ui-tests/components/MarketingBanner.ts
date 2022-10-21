/* eslint-disable lines-between-class-members */
import { Page } from '@playwright/test';
import IPage from '@tests/pages/page.interface';

export default class MarketingBanner implements IPage {
  constructor(readonly page: Page) {
    this.page = page;
  }

  messages = {
    title: 'Welcome to Percona Portal!',
    description: 'Want to know the latest Percona Platform and Percona services news?',
  };

  elements = {
    banner: this.page.locator('//div[@data-testid="marketing-banner"]'),
    title: this.page.locator('//p[@data-testid="marketing-banner-title"]'),
    description: this.page.locator('//p[@data-testid="marketing-banner-description"]'),
  };

  fields = {};

  buttons = {
    accept: this.page.locator('//button[@data-testid="accept-marketing"]'),
    reject: this.page.locator('//button[@data-testid="reject-marketing"]'),
  };
}
