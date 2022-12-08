import { Page } from '@playwright/test';
import { CommonPage } from './common.page';

export default class ProfilePage extends CommonPage {
  constructor(page: Page) {
    super(page);
  }

  // Elements
  profileForm = this.page.locator('//form[@data-testid="profile-form"]');
  emailInput = this.page.locator('//input[@data-testid="email-text-input"]');
  emailInputLabel = this.page.locator('//label[@data-testid="email-field-label"]');
  firstNameInput = this.page.locator('//input[@data-testid="firstName-text-input"]');
  firstNameInputLabel = this.page.locator('//label[@data-testid="firstName-field-label"]');
  firstNameValidationError = this.page.locator('//p[@data-testid="firstName-field-error-message"]');
  lastNameInput = this.page.locator('//input[@data-testid="lastName-text-input"]');
  lastNameInputLabel = this.page.locator('//label[@data-testid="lastName-field-label"]');
  lastNameValidationError = this.page.locator('//p[@data-testid="lastName-field-error-message"]');
  saveProfileButton = this.page.locator('//button[@data-qa="profile-submit-button"]');
  editProfileButton = this.page.locator('//a[@data-testid="profile-edit-button"]');
  profileHeader = this.page.locator('//legend[@data-testid="profile-settings-header"]');

  // Labels
  profileSettingsTitle = 'Profile Settings';

  // Messages
  toLongString = (field: string) => `${field} must be at most 50 characters`;
  profileUpdated = 'Your profile information has been saved';

  // Links
  editUser = 'https://id-dev.percona.com/enduser/settings';
}
