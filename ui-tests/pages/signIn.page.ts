/* eslint-disable lines-between-class-members */
import { Page } from '@playwright/test';
import ResetPassword from '@tests/components/Auth/ResetPassword';
import { CommonPage } from './common.page';

export class SignInPage extends CommonPage {
  constructor(page: Page) {
    super(page);
  }

  resetPassword = new ResetPassword(this.page);

  elements = {
    tosLabel: this.page.getByTestId('tos-label'),
  };

  messages = {
    tosAgree: "By registering, I agree to Percona's Terms of Service and Percona Privacy Policy.",
  };

  forgotPassword = 'Forgot password?';
  formHeaderText = 'Sign in to Percona Platform';
  helpLinkText = 'Help';
  needHelpText = 'Need help signing in?';
  nextButtonText = 'Next';
  signUpLinkText = 'Create one';
  unableToSignIn = 'Unable to sign in';
  continueGoogleLabel = 'Continue with Google';
  continueGitHubLabel = 'Continue with GitHub';
  signInContainer = this.page.locator('//div[@id="auth-center"]');
  emailInput = this.page.locator('[id=idp-discovery-username]');
  forgotPasswordLink = this.page.locator('[data-se=forgot-password]');
  formHeader = this.page.locator('[data-se=o-form-head]');
  helpLink = this.page.locator('[data-se=help-link]');
  needHelp = this.page.locator('//*[@data-se="needhelp"]');
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

  uiLogin = async (username: string, password: string) => {
    await this.fillOutSignInUserDetails(username, password);
    await this.signInButton.click();
    await this.waitForPortalLoaded();
  };
}
