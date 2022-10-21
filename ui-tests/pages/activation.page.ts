/* eslint-disable lines-between-class-members */
import { Locator, Page } from '@playwright/test';

export class ActivationPage {
  // eslint-disable-next-line no-empty-function
  constructor(readonly page: Page) {}

  activationTitle: Locator = this.page.locator('//h1[@data-testid="activation-title"]');
  firstNameInput: Locator = this.page.locator('//input[@data-testid="firstName-text-input"]');
  lastNameInput: Locator = this.page.locator('//input[@data-testid="lastName-text-input"]');
  passwordInput: Locator = this.page.locator('//input[@data-testid="password-password-input"]');
  repeatPasswordInput: Locator = this.page.locator('//input[@data-testid="repeatPassword-password-input"]');
  activateAccountButton: Locator = this.page.locator('//button[@data-testid="activate-account-button"]');
  tosCheckbox: Locator = this.page.locator('//input[@data-testid="tos-checkbox-input"]');
  tosCheckboxLabel: Locator = this.page.locator('//label[@data-testid="tos-field-label"]');

  expiredTokenTitle: string = 'Token Expired';
}
