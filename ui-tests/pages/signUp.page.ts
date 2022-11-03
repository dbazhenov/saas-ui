import { Locator, Page, expect } from '@playwright/test';
import { CommonPage } from '@pages/common.page';
import User from '../support/types/user.interface';

interface Labels {
  readonly emailPlaceholder: string;
  readonly passwordPlaceholder: string;
  readonly firstNamePlaceholder: string;
  readonly lastNamePlaceholder: string;
  readonly activateAccount: string;
  readonly activateEmailSubject: string;
  readonly activateEmailHeader: string;
  readonly verificationEmailBackToSignIn: string;
  readonly tosAgree: string;
}

interface Messages {
  readonly emailAlreadyRegistered: string;
  readonly invalidEmail: string;
  readonly blankFieldError: string;
  readonly validationErrorAlert: string;
  readonly verificationEmailSentTitle: string;
  readonly verificationEmailSentDesc: (email: string) => string;
  readonly activateEmailFooter: string;
}

interface Links {
  readonly registerAddressLink: string;
  readonly platformPrivacyLink: string;
  readonly platformTermsLink: string;
}

interface Locators {
  readonly inputEmail: Locator;
  readonly inputPassword: Locator;
  readonly inputPasswordChildren: Locator;
  readonly inputFirstName: Locator;
  readonly inputLastName: Locator;
  readonly createOneLink: Locator;
  readonly registerButton: Locator;
  readonly registrationAlertMessage: Locator;
  readonly registrationCompleteDesc: Locator;
  readonly registrationCompleteBackLink: Locator;
  readonly verificationContainer: Locator;
  readonly registrationContainer: Locator;
  readonly tosLabel: Locator;
  readonly tosLink: Locator;
  readonly privacyPolicyLink: Locator;
  readonly verificationEmailSentTitleLoc: Locator;
  readonly succIcon: Locator;
  readonly marketingCheckbox: Locator;
  readonly tosCheckbox: Locator;
  readonly emailFieldValidator: Locator;
  readonly fieldFormValidator: Locator;
}

export class SignUpPage extends CommonPage {
  readonly page: Page;

  readonly locators: Locators;

  readonly labels: Labels;

  readonly messages: Messages;

  readonly links: Links;

  constructor(page: Page) {
    super(page);
    this.page = page;

    this.labels = {
      emailPlaceholder: 'Work Email *',
      passwordPlaceholder: 'Password *',
      firstNamePlaceholder: 'First name *',
      lastNamePlaceholder: 'Last name *',
      activateAccount: 'Activate Account',
      activateEmailHeader: 'Welcome to Percona Platform!',
      activateEmailSubject: 'Percona Account Activation',
      verificationEmailBackToSignIn: 'Back to sign in',
      tosAgree:
        'I agree with Percona Terms of Service. I have read and accepted the Percona Privacy Policy.\xa0*',
    };

    this.links = {
      registerAddressLink: 'https://id-dev.percona.com/signin/register',
      platformPrivacyLink: 'https://per.co.na/pmm/platform-privacy',
      platformTermsLink: 'https://per.co.na/pmm/platform-terms',
    };
    this.messages = {
      verificationEmailSentTitle: 'Verification email sent',
      verificationEmailSentDesc: (email) => `To finish signing in, check your email (${email}).`,
      activateEmailFooter:
        'This is an automatically generated message by Okta. Replies are not monitored or answered.',
      emailAlreadyRegistered: 'An account with that Work Email already exists',
      invalidEmail: 'This value is not a valid email address',
      blankFieldError: 'This field cannot be left blank',
      validationErrorAlert: 'We found some errors. Please review the form and make corrections.',
    };
    this.locators = {
      inputEmail: page.locator('//span[@data-se="o-form-input-email"]//input'),
      inputPassword: page.locator('//span[@data-se="o-form-input-password"]//input'),
      inputPasswordChildren: page.locator('[type="password"]'),
      inputFirstName: page.locator('//span[@data-se="o-form-input-firstName"]//input'),
      inputLastName: page.locator('//span[@data-se="o-form-input-lastName"]//input'),
      registerButton: page.locator('[type="submit"]'),
      registrationAlertMessage: page.locator('.okta-form-infobox-error'),
      verificationEmailSentTitleLoc: page.locator('h2.title'),
      registrationCompleteDesc: page.locator('.desc'),
      registrationCompleteBackLink: page.locator('//a[@class="back-btn"]'),
      registrationContainer: page.locator('[data-se="o-form-error-container"]'),
      verificationContainer: page.locator('[data-se="auth-container"]'),
      tosLabel: page.locator('[data-testid="tos-label"]'),
      tosLink: page.locator('tos-link'),
      privacyPolicyLink: page.locator('privacy-policy-link'),
      createOneLink: page.locator('.registration-link'),
      marketingCheckbox: page.locator('[data-se-for-name="marketing"]'),
      tosCheckbox: page.locator('[data-se-for-name="tos"]'),
      succIcon: page.locator('.container .title-icon '),
      emailFieldValidator: page.locator(
        'div[data-se="o-form-fieldset-container"] > div:first-child p[role="alert"]',
      ),
      fieldFormValidator: page.locator('p.o-form-input-error'),
    };
  }

  fillOutSignUpUserDetails = async (user: User, options = { tos: true, marketing: true }) => {
    // Verify placeholders
    await this.verifyPlaceholders;
    // filled the form
    await this.locators.inputEmail.click();
    await this.locators.inputEmail.type(user.email);
    await this.locators.inputPassword.click();
    await this.locators.inputPassword.type(user.password);
    await this.locators.inputFirstName.click();
    await this.locators.inputFirstName.type(user.firstName);
    await this.locators.inputLastName.click();
    await this.locators.inputLastName.type(user.lastName);
    // check required checkboxes

    await this.handleCheckBoxes(options);
  };

  waitForSucRegToBeLoaded = async () => {
    await this.locators.registrationCompleteDesc.waitFor({ state: 'visible', timeout: 60000 });
    await this.locators.registrationCompleteBackLink.waitFor({ state: 'visible', timeout: 60000 });
    await this.locators.succIcon.waitFor({ state: 'visible', timeout: 60000 });
  };

  private handleCheckBoxes = async (options = { tos: true, marketing: true }) => {
    if (options.tos) {
      await this.locators.tosCheckbox.check();
    }

    if (options.marketing) {
      await this.locators.marketingCheckbox.check();
    }
  };

  private verifyPlaceholders = async () => {
    await expect(this.locators.inputEmail).toHaveAttribute('placeholder', this.labels.emailPlaceholder);
    await expect(this.locators.inputPassword).toHaveAttribute('placeholder', this.labels.passwordPlaceholder);
    await expect(this.locators.inputFirstName).toHaveAttribute(
      'placeholder',
      this.labels.firstNamePlaceholder,
    );
    await expect(this.locators.inputLastName).toHaveAttribute('placeholder', this.labels.lastNamePlaceholder);
  };
}
