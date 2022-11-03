/* eslint-disable lines-between-class-members */
import { Locator, Page } from '@playwright/test';
import { CommonPage } from './common.page';

export class SignInPage extends CommonPage {
  readonly page: Page;

  readonly forgotPassword: string;
  readonly formHeaderText: string;
  readonly helpLinkText: string;
  readonly needHelpText: string;
  readonly nextButtonText: string;
  readonly signUpLinkText: string;
  readonly unableToSignIn: string;
  readonly tosAgree: string;
  readonly continueGoogleLabel: string;
  readonly continueGitHubLabel: string;

  readonly signInContainer: Locator;
  readonly emailInput: Locator;
  readonly forgotPasswordLink: Locator;
  readonly formHeader: Locator;
  readonly helpLink: Locator;
  readonly needHelp: Locator;
  readonly nextButton: Locator;
  readonly passwordInput: Locator;
  readonly signInButton: Locator;
  readonly signUpLink: Locator;
  readonly signInErrorContainer: Locator;
  readonly continueGoogle: Locator;
  readonly continueGitHub: Locator;
  readonly googleEmailField: Locator;
  readonly gitHubEmailField: Locator;

  constructor(page: Page) {
    super(page);

    this.page = page;
    this.forgotPassword = 'Forgot password?';
    this.formHeaderText = 'Sign in to Percona Platform';
    this.helpLinkText = 'Help';
    this.needHelpText = 'Need help signing in?';
    this.nextButtonText = 'Next';
    this.signUpLinkText = 'Create one';
    this.unableToSignIn = 'Unable to sign in';
    this.tosAgree =
      "By registering, I agree to Percona's Terms of Service and Percona Privacy Policy. I consent to receive relevant communications about Percona services and understand that I can unsubscribe from these communications at any time in accordance with the Percona Privacy Policy.";
    this.continueGoogleLabel = 'Continue with Google';
    this.continueGitHubLabel = 'Continue with GitHub';
    this.signInContainer = page.locator('//div[@id="auth-center"]');
    this.emailInput = page.locator('[id=idp-discovery-username]');
    this.forgotPasswordLink = page.locator('[data-se=forgot-password]');
    this.formHeader = page.locator('[data-se=o-form-head]');
    this.helpLink = page.locator('[data-se=help-link]');
    this.needHelp = page.locator('[data-se=needhelp]');
    this.nextButton = page.locator('[id=idp-discovery-submit]');
    this.passwordInput = page.locator('[id=okta-signin-password]');
    this.signInButton = page.locator('[id=okta-signin-submit]');
    this.signUpLink = page.locator('.registration-link');
    this.signInErrorContainer = page.locator('[data-se="o-form-error-container"]');
    this.continueGoogle = page.locator('[data-se="social-auth-google-button"]');
    this.continueGitHub = page.locator('[data-se="social-auth-github-button"]');
    this.googleEmailField = page.locator('//input[@type="email"]');
    this.gitHubEmailField = page.locator('//input[@id="login_field"]');
  }

  fillOutSignInUserDetails = async (username: string, password: string) => {
    await this.emailInput.type(username);
    await this.nextButton.click();
    await this.passwordInput.type(password);
  };
}
