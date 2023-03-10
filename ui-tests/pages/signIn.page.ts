import { Page } from '@playwright/test';
import ResetPassword from '@tests/components/Auth/ResetPassword';
import { CommonPage } from './common.page';
import LandingPage from './landing.page';

export class SignInPage extends CommonPage {
  constructor(page: Page) {
    super(page);
  }

  resetPassword = new ResetPassword(this.page);

  elements = {
    tosLabel: this.page.getByTestId('tos-label'),
    signInContainer: this.page.locator('//div[@id="auth-center"]'),
    forgotPasswordLink: this.page.locator('[data-se=forgot-password]'),
    formHeader: this.page.locator('[data-se=o-form-head]'),
    helpLink: this.page.locator('[data-se=help-link]'),

    signUpLink: this.page.locator('.registration-link'),
    signInErrorContainer: this.page.locator('[data-se="o-form-error-container"]'),
  };

  fields = {
    email: this.page.locator('[id=idp-discovery-username]'),
    password: this.page.locator('[id=okta-signin-password]'),
    googleEmail: this.page.locator('//input[@type="email"]'),
    gitHubEmail: this.page.locator('//input[@id="login_field"]'),
  };

  labels = {
    forgotPassword: 'Forgot password?',
    formHeaderText: 'Sign in to Percona Platform',
    helpLinkText: 'Help',
    needHelp: 'Need help signing in?',
    nextButtonText: 'Next',
    signUpLinkText: 'Create one',
    unableToSignIn: 'Unable to sign in',
    continueGoogle: 'Continue with Google',
    continueGitHub: 'Continue with GitHub',
    emailSubject: 'Account password reset',
  };

  buttons = {
    next: this.page.locator('[id=idp-discovery-submit]'),
    signIn: this.page.locator('[id=okta-signin-submit]'),
    continueGoogle: this.page.locator('[data-se="social-auth-google-button"]'),
    continueGitHub: this.page.locator('[data-se="social-auth-github-button"]'),
    forgotPassword: this.page.locator('[data-se=forgot-password]'),
    needHelp: this.page.locator('[data-se=needhelp]'),
  };

  messages = {
    tosAgree:
      'By submitting my personal information, I acknowledge that Percona will communicate with me about its products and services. I understand that I can unsubscribe from these communications in accordance with the Percona Privacy Policy.',
  };

  links = {};

  fillOutSignInUserDetails = async (username: string, password: string) => {
    await this.fields.email.type(username);
    await this.buttons.next.click();
    await this.fields.password.type(password);
  };

  uiLogin = async (username: string, password: string) => {
    await new LandingPage(this.page).buttons.login.click();
    await this.fillOutSignInUserDetails(username, password);
    await this.buttons.signIn.click();
    await this.waitForPortalLoaded();
  };
}
