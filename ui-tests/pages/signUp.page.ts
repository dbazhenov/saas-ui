import { Page, expect } from '@playwright/test';
import { CommonPage } from '@pages/common.page';
import User from '../support/types/user.interface';

export class SignUpPage extends CommonPage {
  constructor(page: Page) {
    super(page);
  }

  elements = {
    marketingLabel: this.page.getByTestId('marketing-label'),
    tosLabel: this.page.getByTestId('tos-label'),
  };

  messages = {
    tosAgree: 'I agree with Percona Terms of Service. I have read and accepted the Percona Privacy Policy. *',
  };

  // Elements
  inputEmail = this.page.locator('//span[@data-se="o-form-input-email"]//input');
  inputPassword = this.page.locator('//span[@data-se="o-form-input-password"]//input');
  inputPasswordChildren = this.page.locator('[type="password"]');
  inputFirstName = this.page.locator('//span[@data-se="o-form-input-firstName"]//input');
  inputLastName = this.page.locator('//span[@data-se="o-form-input-lastName"]//input');
  registerButton = this.page.locator('[type="submit"]');
  registrationAlertMessage = this.page.locator('.okta-form-infobox-error');
  verificationEmailSentTitleLoc = this.page.locator('h2.title');
  registrationCompleteDesc = this.page.locator('.desc');
  registrationCompleteBackLink = this.page.locator('//a[@class="back-btn"]');
  registrationContainer = this.page.locator('[data-se="o-form-error-container"]');
  verificationContainer = this.page.locator('[data-se="auth-container"]');

  tosLink = this.page.locator('tos-link');
  privacyPolicyLink = this.page.locator('privacy-policy-link');
  createOneLink = this.page.locator('.registration-link');
  marketingCheckbox = this.page.locator('[data-se-for-name="marketing"]');
  tosCheckbox = this.page.locator('//input[@name="tos"]');
  successIcon = this.page.locator('.container .title-icon ');
  emailFieldValidator = this.page.locator(
    'div[data-se="o-form-fieldset-container"] > div:first-child p[role="alert"]',
  );
  fieldFormValidator = this.page.locator('p.o-form-input-error');
  backToSingIn = this.page.locator('[data-se="back-link"]');

  // Messages
  verificationEmailSentTitle = 'Verification email sent';
  verificationEmailSentDesc = (email) => `To finish signing in, check your email (${email}).`;
  activateEmailFooter: 'This is an automatically generated message by Okta. Replies are not monitored or answered.';
  emailAlreadyRegistered = 'An account with that Work Email already exists';
  invalidEmail = 'This value is not a valid email address';
  blankFieldError = 'This field cannot be left blank';
  validationErrorAlert = 'We found some errors. Please review the form and make corrections.';

  // Labels
  emailPlaceholder = 'Work Email *';
  passwordPlaceholder = 'Password *';
  firstNamePlaceholder = 'First name *';
  lastNamePlaceholder = 'Last name *';
  activateAccount = 'Activate Account';
  activateEmailHeader = 'Welcome to Percona Platform!';
  activateEmailSubject = 'Percona Account Activation';
  verificationEmailBackToSignIn = 'Back to sign in';

  // Links
  registerAddressLink = 'https://id-dev.percona.com/signin/register';
  platformPrivacyLink = 'https://www.percona.com/privacy-policy';
  platformTermsLink = 'https://per.co.na/pmm/platform-terms';

  fillOutSignUpUserDetails = async (user: User, options = { tos: true }) => {
    // Verify placeholders
    await this.verifyPlaceholders();
    // filled the form
    await this.inputEmail.click();
    await this.inputEmail.type(user.email);
    await this.inputPassword.click();
    await this.inputPassword.type(user.password);
    await this.inputFirstName.click();
    await this.inputFirstName.type(user.firstName);
    await this.inputLastName.click();
    await this.inputLastName.type(user.lastName);
    // check required checkboxes

    await this.handleCheckBoxes(options);
  };

  waitForSucRegToBeLoaded = async () => {
    await this.registrationCompleteDesc.waitFor({ state: 'visible', timeout: 60000 });
    await this.registrationCompleteBackLink.waitFor({ state: 'visible', timeout: 60000 });
    await this.successIcon.waitFor({ state: 'visible', timeout: 60000 });
  };

  private handleCheckBoxes = async (options = { tos: true }) => {
    if (options.tos) {
      await this.tosCheckbox.check({ force: true });
    }
  };

  private verifyPlaceholders = async () => {
    await expect(this.inputEmail).toHaveAttribute('placeholder', this.emailPlaceholder);
    await expect(this.inputPassword).toHaveAttribute('placeholder', this.passwordPlaceholder);
    await expect(this.inputFirstName).toHaveAttribute('placeholder', this.firstNamePlaceholder);
    await expect(this.inputLastName).toHaveAttribute('placeholder', this.lastNamePlaceholder);
  };
}
