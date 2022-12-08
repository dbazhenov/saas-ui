/* eslint-disable lines-between-class-members */
import { Locator, Page } from '@playwright/test';
import { locatorToSelector } from '../helpers/locatorHelper';

export default class Toast {
  constructor(readonly page: Page) { }
  toastElementContainer = this.page.locator('//div[contains(@class, "toast-container")]');
  toastElement = this.page.locator('//div[@role="alert"]');
  toastCloseButton = this.page.locator('//*[@aria-label="close"]');

  checkToastMessage = async (message: string, timeout: number = 60000) => {
    // TODO: to improve
    await this.page.locator(`//div[contains(text(), "${message}")]`).waitFor({ state: 'visible', timeout });

    // TODO: to improve
    const toastCloseButtonLocator: Locator = this.page.locator(
      `//div[contains(text(), "${message}")]/parent::div${locatorToSelector(this.toastCloseButton)}`,
    );

    await toastCloseButtonLocator.click();
    await toastCloseButtonLocator.waitFor({ state: 'detached' });
  };
}
