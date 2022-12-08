/* eslint-disable lines-between-class-members */
import { Page } from '@playwright/test';
import { CommonPage } from './common.page';

export class SignInPage extends CommonPage {
  constructor(page: Page) {
    super(page);
  }
  forgotPassword = 'Forgot password?';
  formHeaderText = 'Sign in to Percona Platform';
  helpLinkText = 'Help';
  needHelpText = 'Need help signing in?';
  nextButtonText = 'Next';
  signUpLinkText = 'Create one';
  unableToSignIn = 'Unable to sign in';
  tosAgree =
    "By registering, I agree to Percona's Terms of Service and Percona Privacy Policy. I consent to receive relevant communications about Percona services and understand that I can unsubscribe from these communications at any time in accordance with the Percona Privacy Policy.";
  continueGoogleLabel = 'Continue with Google';
  continueGitHubLabel = 'Continue with GitHub';
  signInContainer = this.page.locator('//div[@id="auth-center"]');
  emailInput = this.page.locator('[id=idp-discovery-username]');
  forgotPasswordLink = this.page.locator('[data-se=forgot-password]');
  formHeader = this.page.locator('[data-se=o-form-head]');
  helpLink = this.page.locator('[data-se=help-link]');
  needHelp = this.page.locator('[data-se=needhelp]');
  nextButton = this.page.locator('[id=idp-discovery-submit]');
  passwordInput = this.page.locator('[id=okta-signin-password]');
  signInButton = this.page.locator('[id=okta-signin-submit]');
  signUpLink = this.page.locator('.registration-link');
  signInErrorContainer = this.page.locator('[data-se="o-form-error-container"]');
  continueGoogle = this.page.locator('[data-se="social-auth-google-button"]');
  continueGitHub = this.page.locator('[data-se="social-auth-github-button"]');
  googleEmailField = this.page.locator('//input[@type="email"]');
  gitHubEmailField = this.page.locator('//input[@id="login_field"]');

  fillOutSignInUserDetails = async (username: string, password: string) => {
    await this.emailInput.type(username);
    await this.nextButton.click();
    await this.passwordInput.type(password);
  };
}
