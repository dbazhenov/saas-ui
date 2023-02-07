import { Page } from '@playwright/test';
import { CommonPage } from './common.page';

export default class LandingPage extends CommonPage {
  constructor(page: Page) {
    super(page);
  }

  // Containers
  landingPageContainer = this.page.getByTestId('landing-page-container');

  // Elements

  // Buttons
  createAccountButton = this.landingPageContainer.getByTestId('create-account');
  loginButton = this.landingPageContainer.getByTestId('login-button');

  // Messages

  // Links
}
