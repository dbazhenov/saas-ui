// data-testid="not-found-container"
import { Page } from '@playwright/test';
import { CommonPage } from './common.page';

export class NotFoundPage extends CommonPage {
  constructor(page: Page) {
    super(page);
  }
  notFoundPageContainer = this.page.locator('//div[@data-testid="not-found-container"]');
  notFoundImage = this.page.locator('//img[@data-testid="404-image"]');
  notFoundHomeButton = this.page.locator('//button[@data-testid="404-home-button"]');
}
