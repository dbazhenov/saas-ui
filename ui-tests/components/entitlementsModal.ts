/* eslint-disable lines-between-class-members */
import { Locator, Page } from '@playwright/test';
import ModalWindow from './modalWindow';

export default class EntitlementsModal extends ModalWindow {
  readonly page: Page;

  readonly entitlementsButton: Locator;
  readonly numberEntitlements: Locator;
  readonly entitlementContainer: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;

    this.entitlementsButton = page.locator('//button[@data-testid="entitlements-button"]');
    this.numberEntitlements = page.locator('//span[@data-testid="number-entitlements"]');
    this.entitlementContainer = this.page.locator('//div[contains(@class, "collapse panel-container")]');
  }
}
