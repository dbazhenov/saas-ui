import { Page } from '@playwright/test';
import { CommonPage } from './common.page';

export default class PMMInstances extends CommonPage {
  constructor(page: Page) {
    super(page);
  }

  // Elements
  container = this.page.locator('//div[@data-testid="instances-list-wrapper"]');
  header = this.page.locator('//header[@data-testid="manage-pmm-instances-header"]');
  readMore = this.page.locator('//a[@data-testid="connect-pmm-link"]');

  // Messages 
  readMoreMessage = 'How-to connect Percona Monitoring & Management';

  // links
  readMoreLink = 'https://docs.percona.com/percona-platform/connect-pmm.html';
}
