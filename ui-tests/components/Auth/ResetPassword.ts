import { Page } from '@playwright/test';

export default class ResetPassword {
  constructor(readonly page: Page) {}

  container = this.page.locator('//*[@data-se="auth-container"]');

  elements = {
    header: this.container.locator('//*[@data-se="o-form-head"]'),
    emailSent: this.container.locator('//* [@data-se="o-form-explain"]'),
  };

  fields = {
    username: this.container.locator('//*[@id="account-recovery-username"]'),
    newPassword: this.page.locator('//*[@name="newPassword"]'),
    confirmNewPassword: this.page.locator('//*[@name="confirmPassword"]'),
  };

  buttons = {
    reset: this.container.locator('//*[@data-se="email-button" or @type="submit"]'),
    backButton: this.container.locator('//*[@data-se="back-button"]'),
    backLink: this.container.locator('//*[@data-se="back-link"]'),
  };

  labels = {
    passwordResetEmailSubject: 'Account password reset',
  };

  messages = {
    emailSent: (email: string) =>
      `Email has been sent to ${email} with instructions on resetting your password.`,
  };
}
