/* eslint-disable lines-between-class-members */
import { Page } from '@playwright/test';
import ModalWindow from './modalWindow';

export default class EntitlementsModal extends ModalWindow {
  constructor(page: Page) {
    super(page);
  }

  messages = { ...this.messages };

  elements = {
    ...this.elements,
    entitlementsRow: this.page.locator('//p[@data-testid="entitlements-row"]'),
    entitlementsButton: this.page.locator('//button[@data-testid="entitlements-button"]'),
    numberEntitlements: this.page.locator('//span[@data-testid="number-entitlements"]'),
    entitlementContainer: this.page.locator('//div[contains(@class, "collapse panel-container")]'),
  };

  fields = { ...this.fields };

  buttons = { ...this.buttons };
}
