/* eslint-disable lines-between-class-members */
import { Locator, Page } from '@playwright/test';
import { locatorToSelector } from '../helpers/locatorHelper';

export default class Toast {
  readonly page: Page;

  readonly toastElementContainer: Locator;
  readonly toastElement: Locator;
  readonly toastCloseButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.toastElementContainer = this.page.locator('//div[contains(@class, "toast-container")]');
    this.toastElement = this.page.locator('//div[@role="alert"]');
    this.toastCloseButton = page.locator('//*[@aria-label="close"]');
  }

  checkToastMessage = async (message: string) => {
    // TODO: to improve
    await this.page.locator(`//div[contains(text(), "${message}")]`).waitFor({ state: 'visible' });

    // TODO: to improve
    const toastCloseButtonLocator: Locator = this.page.locator(
      `//div[contains(text(), "${message}")]/parent::div${locatorToSelector(this.toastCloseButton)}`,
    );

    await toastCloseButtonLocator.click();
    await toastCloseButtonLocator.waitFor({ state: 'detached' });
  };
}
