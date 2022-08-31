/* eslint-disable lines-between-class-members */
import { Locator, Page } from '@playwright/test';
import { CommonPage } from './common.page';

interface Labels {
  profileSettingsTitle: string;
}
interface Links {
  editUser: string;
}
interface Locators {
  profileForm: Locator;
  profileHeader: Locator;
  emailInput: Locator;
  emailInputLabel: Locator;
  firstNameInput: Locator;
  firstNameInputLabel: Locator;
  firstNameValidationError: Locator;
  lastNameInput: Locator;
  lastNameInputLabel: Locator;
  lastNameValidationError: Locator;
  saveProfileButton: Locator;
  editProfileButton: Locator;
}

interface Messages {
  toLongString: string;
  profileUpdated: string;
}

export default class ProfilePage extends CommonPage {
  readonly page: Page;
  readonly labels: Labels;
  readonly links: Links;
  readonly locators: Locators;
  readonly messages: Messages;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.labels = {
      profileSettingsTitle: 'Profile Settings',
    };
    this.links = {
      editUser: 'https://id-dev.percona.com/enduser/settings',
    };
    this.locators = {
      profileForm: page.locator('//form[@data-testid="profile-form"]'),
      emailInput: page.locator('//input[@data-testid="email-text-input"]'),
      emailInputLabel: page.locator('//label[@data-testid="email-field-label"]'),
      firstNameInput: page.locator('//input[@data-testid="firstName-text-input"]'),
      firstNameInputLabel: page.locator('//label[@data-testid="firstName-field-label"]'),
      firstNameValidationError: page.locator('//div[@data-testid="firstName-field-error-message"]'),
      lastNameInput: page.locator('//input[@data-testid="lastName-text-input"]'),
      lastNameInputLabel: page.locator('//label[@data-testid="lastName-field-label"]'),
      lastNameValidationError: page.locator('//div[@data-testid="lastName-field-error-message"]'),
      saveProfileButton: page.locator('//button[@data-qa="profile-submit-button"]'),
      editProfileButton: page.locator('//a[@data-testid="profile-edit-button"]'),
      profileHeader: page.locator('//legend'),
    };

    this.messages = {
      toLongString: 'Must contain at most 50 characters',
      profileUpdated: 'Your profile information has been saved',
    };
  }
}
