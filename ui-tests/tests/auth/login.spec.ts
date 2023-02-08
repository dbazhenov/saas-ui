import { expect, test } from '@playwright/test';
import { DashboardPage } from '@pages/dashboard.page';
import { SignInPage } from '@pages/signIn.page';
import User from '@support/types/user.interface';
import { oktaAPI } from '@api/okta';
import LandingPage from '@tests/pages/landing.page';
import {
  deleteMailosaurMessage,
  getMailosaurMessage,
  getMessageLinkByText,
  getRandomMailosaurEmailAddress,
} from '@tests/api/helpers';
import { SignUpPage } from '@tests/pages/signUp.page';
import Duration from '@tests/helpers/Duration';

test.describe('Spec file for dashboard tests for customers', async () => {
  let adminUser: User;

  test.beforeEach(async ({ page }) => {
    if (test.info().title.includes('SAAS-T283 ')) {
      adminUser = await oktaAPI.createTestUser(getRandomMailosaurEmailAddress());
    } else {
      adminUser = await oktaAPI.createTestUser();
    }

    await page.goto('/');
  });

  test.afterEach(async () => {
    if (await oktaAPI.getUser(adminUser.email)) {
      await oktaAPI.deleteUserByEmail(adminUser.email);
    }
  });

  test('SAAS-T251 - Verify handling of status 401 @auth', async ({ page, baseURL }) => {
    const signInPage = new SignInPage(page);
    const dashboardPage = new DashboardPage(page);
    const landingPage = new LandingPage(page);

    await oktaAPI.loginByOktaApi(adminUser, page);
    await dashboardPage.contacts.accountLoadingSpinner.waitFor({ state: 'detached' });
    await dashboardPage.contacts.contactsLoadingSpinner.waitFor({ state: 'detached' });

    await oktaAPI.deleteUserByEmail(adminUser.email);
    await page.reload();
    await landingPage.landingPageContainer.waitFor({ state: 'visible' });
    expect(page.url()).toEqual(`${baseURL}/`);
    await page.goto(dashboardPage.routes.organization);
    await signInPage.emailInput.waitFor({ state: 'visible' });
    expect(page.url()).toEqual(baseURL + dashboardPage.routes.login);
  });

  test('SAAS-T82 Verify successful login on Percona Portal @login @auth', async ({ page, baseURL }) => {
    const signInPage = new SignInPage(page);
    const dashboardPage = new DashboardPage(page);
    const landingPage = new LandingPage(page);

    await landingPage.buttons.login.click();
    await signInPage.fillOutSignInUserDetails(adminUser.email, adminUser.password);
    await signInPage.signInButton.click();
    await signInPage.waitForPortalLoaded();
    expect(page.url()).toContain(baseURL);

    await dashboardPage.gettingStartedContainer.waitFor({ state: 'visible' });
  });

  if (process.env.CI) {
    // Test Fails on local, runs only in CI.
    test('SAAS-T86 Verify unsuccessful login on Percona Portal @login @auth', async ({ page, context }) => {
      const signInPage = new SignInPage(page);
      const dashboardPage = new DashboardPage(page);
      const landingPage = new LandingPage(page);

      await test.step('SAAS-T245 Verify user is able to see "Continue with.." buttons', async () => {
        await landingPage.buttons.login.click();
        await expect(signInPage.continueGoogle).toHaveText(signInPage.continueGoogleLabel);
        await expect(signInPage.continueGitHub).toHaveText(signInPage.continueGitHubLabel);

        const [googlePage] = await Promise.all([
          context.waitForEvent('page'),
          signInPage.continueGoogle.click(),
        ]);
        const googleSigInPage = new SignInPage(googlePage);

        await googleSigInPage.googleEmailField.waitFor({ state: 'visible', timeout: 60000 });

        expect(googlePage.url()).toContain('https://accounts.google.com/o/oauth2/auth/');
        await googlePage.close();

        const [gitHubPage] = await Promise.all([
          context.waitForEvent('page'),
          signInPage.continueGitHub.click(),
        ]);
        const gitHubSigInPage = new SignInPage(gitHubPage);

        await gitHubSigInPage.gitHubEmailField.waitFor({ state: 'visible', timeout: 60000 });

        expect(gitHubPage.url()).toContain('https://github.com/login');
        await gitHubPage.close();
      });

      await signInPage.fillOutSignInUserDetails('Wrong Username', 'WrongPassword');
      await signInPage.signInButton.click();
      await signInPage.signInErrorContainer.waitFor({ state: 'visible' });
      await expect(signInPage.signInErrorContainer).toHaveText(signInPage.unableToSignIn);
      expect(page.url()).toContain(dashboardPage.routes.login);

      await dashboardPage.gettingStartedContainer.waitFor({ state: 'detached' });
    });
  }

  test('SAAS-T282 - Verify elements on Landing page @login @auth', async ({ page, context }) => {
    const signInPage = new SignInPage(page);
    const signUpPage = new SignUpPage(page);
    const landingPage = new LandingPage(page);

    await test.step(
      '1. On landing page verify there is "Create Percona Account" and "Sign In"buttons on the top of the page',
      async () => {
        await landingPage.buttons.login.waitFor({ state: 'visible' });
        await landingPage.buttons.createAccount.waitFor({ state: 'visible' });
      },
    );

    await test.step(
      '2. Click on "Create Percona Account" button and verify Sing Up page is opened',
      async () => {
        await expect(landingPage.buttons.createAccount).toHaveText(landingPage.labels.createAccount);
        await landingPage.buttons.createAccount.click();
        await signUpPage.inputEmail.waitFor({ state: 'visible' });
        await page.goto('/');
        await landingPage.landingPageContainer.waitFor({ state: 'visible' });
      },
    );

    await test.step(
      '3. Click on "Sign In" button on Landing page and verify "Sign In" page is opened',
      async () => {
        await expect(landingPage.buttons.login).toHaveText(landingPage.labels.signIn);
        await landingPage.buttons.login.click();
        await signInPage.emailInput.waitFor({ state: 'visible' });
        await page.goto('/');
        await landingPage.landingPageContainer.waitFor({ state: 'visible' });
      },
    );

    await test.step(
      '4. Verify there is "Create Percona Account" button in the middle of the page',
      async () => {
        await expect(landingPage.buttons.createPerconaAccount).toHaveText(landingPage.labels.createAccount);
        await landingPage.buttons.createPerconaAccount.click();
        await signUpPage.inputEmail.waitFor({ state: 'visible' });
        await page.goto('/');
        await landingPage.landingPageContainer.waitFor({ state: 'visible' });
      },
    );

    await test.step('5. Verify there is "Get Demo" button', async () => {
      await expect(landingPage.buttons.getDemo).toHaveText(landingPage.labels.getDemo);
      const [newPage] = await Promise.all([
        context.waitForEvent('page'),
        landingPage.buttons.getDemo.click(),
      ]);

      await expect(newPage).toHaveTitle('Join us for a live Percona Platform Demo');
      await newPage.close();
    });

    await test.step('6. Verify links in the footer of the landing page.', async () => {
      await expect(landingPage.buttons.tosFooter).toHaveText(landingPage.labels.tos);
      let [newPage] = await Promise.all([
        context.waitForEvent('page'),
        landingPage.buttons.tosFooter.click(),
      ]);

      await expect(newPage).toHaveTitle('Percona Platform Terms of Service - Percona');
      newPage.close();

      await expect(landingPage.buttons.privacyFooter).toHaveText(landingPage.labels.privacy);
      [newPage] = await Promise.all([
        context.waitForEvent('page'),
        landingPage.buttons.privacyFooter.click(),
      ]);

      await expect(newPage).toHaveTitle('Privacy Center - Securiti.ai');
      newPage.close();
      await expect(landingPage.buttons.copyrightFooter).toHaveText(landingPage.labels.copyright);
      [newPage] = await Promise.all([
        context.waitForEvent('page'),
        landingPage.buttons.copyrightFooter.click(),
      ]);

      await expect(newPage).toHaveTitle('Copyright Policy - Percona');
      newPage.close();

      await expect(landingPage.buttons.legalFooter).toHaveText(landingPage.labels.legal);
      [newPage] = await Promise.all([context.waitForEvent('page'), landingPage.buttons.legalFooter.click()]);

      await expect(newPage).toHaveTitle('Legal - Percona');
      newPage.close();
      await expect(landingPage.buttons.securityCenterFooter).toHaveText(landingPage.labels.securityCenter);
      [newPage] = await Promise.all([
        context.waitForEvent('page'),
        landingPage.buttons.securityCenterFooter.click(),
      ]);

      await expect(newPage).toHaveTitle('Percona Security & Data Privacy Practices - Percona');
      newPage.close();
    });
  });

  test('SAAS-T283 - Verify Forgot password on Sign In page @login @auth', async ({ page }) => {
    const signInPage = new SignInPage(page);
    const landingPage = new LandingPage(page);
    const newPassword = 'Test12345!';
    let resetPasswordLink: string;

    await test.step('1. Open Sign In page', async () => {
      await landingPage.buttons.login.click();
      await expect(signInPage.needHelp).toHaveText(signInPage.needHelpText, { timeout: Duration.OneMinute });
    });

    await test.step('2. Click on "Need help signing in?" link', async () => {
      await signInPage.needHelp.click();
      await expect(signInPage.forgotPasswordLink).toHaveText(signInPage.forgotPassword);
    });

    await test.step('3. Click on "Forgot password?" link', async () => {
      await signInPage.forgotPasswordLink.click();
      await signInPage.resetPassword.fields.username.waitFor({ state: 'visible' });
    });

    await test.step('4. Fill in email filed and click on "Reset" button', async () => {
      await signInPage.resetPassword.fields.username.type(adminUser.email);
      await signInPage.resetPassword.buttons.reset.click();
    });

    await test.step('5. Verify the message appeared about email successfully sent', async () => {
      await expect(signInPage.resetPassword.elements.emailSent).toHaveText(
        signInPage.resetPassword.messages.emailSent(adminUser.email),
      );
    });

    await test.step(
      '6. Click on "Back to Sign in page" button and verify Sign in page is displayed',
      async () => {
        await signInPage.resetPassword.buttons.back.click();
        await signInPage.emailInput.waitFor({ state: 'visible' });
      },
    );

    await test.step(
      '7. Verify that the email with subject "Account password reset" and link to password reset was sent',
      async () => {
        const passwordResetMessage = await getMailosaurMessage(
          adminUser.email,
          signInPage.resetPassword.labels.passwordResetEmailSubject,
        );

        await deleteMailosaurMessage(passwordResetMessage.id);
        resetPasswordLink = getMessageLinkByText(passwordResetMessage, 'Reset Password');
      },
    );

    await test.step('8. Go to reset password link and reset user password', async () => {
      await page.goto(resetPasswordLink);
      await signInPage.resetPassword.fields.newPassword.type(newPassword);
      await signInPage.resetPassword.fields.confirmNewPassword.type(newPassword);
      await signInPage.resetPassword.buttons.reset.click();
      await signInPage.resetPassword.buttons.reset.waitFor({ state: 'detached' });
    });

    await test.step('9. Login with the new password', async () => {
      await page.goto('/');
      await landingPage.buttons.login.click();
      await signInPage.uiLogin(adminUser.email, newPassword);
    });
  });
});
