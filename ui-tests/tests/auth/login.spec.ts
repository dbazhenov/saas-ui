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
import { OrganizationPage } from '@tests/pages/organization.page';
import { MembersPage } from '@tests/pages/members.page';
import { getUser } from '@tests/helpers/portalHelper';
import { portalAPI } from '@tests/api';

test.describe('Spec file for dashboard tests for customers', async () => {
  let adminUser: User;
  const notRegisteredUser: User = getUser(getRandomMailosaurEmailAddress());
  let invitedUser: User;

  test.beforeEach(async ({ page }) => {
    invitedUser = await oktaAPI.createTestUser(getRandomMailosaurEmailAddress());
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

    if (await oktaAPI.getUser(notRegisteredUser.email)) {
      await oktaAPI.deleteUserByEmail(notRegisteredUser.email);
    }

    if (await oktaAPI.getUser(invitedUser.email)) {
      await oktaAPI.deleteUserByEmail(invitedUser.email);
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
    await signInPage.fields.email.waitFor({ state: 'visible' });
    expect(page.url()).toEqual(baseURL + dashboardPage.routes.login);
  });

  test('SAAS-T82 Verify successful login on Percona Portal @login @auth', async ({ page, baseURL }) => {
    test.info().annotations.push({
      type: 'Also Covers',
      description: 'SAAS-T246 - Verify Terms of Service and Privacy Policy are displayed on Login page.',
    });
    const signInPage = new SignInPage(page);
    const dashboardPage = new DashboardPage(page);
    const landingPage = new LandingPage(page);

    await test.step('1. Go to Portal and Click on Sign In', async () => {
      await landingPage.buttons.login.click();
    });

    await test.step('2. Verify terms of service displayed on sign in widget.', async () => {
      await expect(signInPage.elements.tosLabel).toHaveText(signInPage.messages.tosAgree);
    });

    await test.step('3. Enter valid credentials.', async () => {
      await signInPage.fillOutSignInUserDetails(adminUser.email, adminUser.password);
    });

    await test.step('4. Verify terms of service displayed on sign in widget.', async () => {
      await expect(signInPage.elements.tosLabel).toHaveText(signInPage.messages.tosAgree);
    });

    await test.step('5. Verify successful login.', async () => {
      await signInPage.buttons.signIn.click();
      await signInPage.waitForPortalLoaded();
      expect(page.url()).toContain(baseURL);

      await dashboardPage.gettingStartedContainer.waitFor({ state: 'visible' });
    });
  });

  if (process.env.CI) {
    // Test Fails on local, runs only in CI.
    test('SAAS-T86 Verify unsuccessful login on Percona Portal @login @auth', async ({ page, context }) => {
      const signInPage = new SignInPage(page);
      const dashboardPage = new DashboardPage(page);
      const landingPage = new LandingPage(page);

      await test.step('SAAS-T245 Verify user is able to see "Continue with.." buttons', async () => {
        await landingPage.buttons.login.click();
        await expect(signInPage.buttons.continueGoogle).toHaveText(signInPage.labels.continueGoogle);
        await expect(signInPage.buttons.continueGitHub).toHaveText(signInPage.labels.continueGitHub);

        const [googlePage] = await Promise.all([
          context.waitForEvent('page'),
          signInPage.buttons.continueGoogle.click(),
        ]);
        const googleSigInPage = new SignInPage(googlePage);

        await googleSigInPage.fields.googleEmail.waitFor({ state: 'visible', timeout: 60000 });

        expect(googlePage.url()).toContain('https://accounts.google.com/o/oauth2/auth');
        await googlePage.close();

        const [gitHubPage] = await Promise.all([
          context.waitForEvent('page'),
          signInPage.buttons.continueGitHub.click(),
        ]);
        const gitHubSigInPage = new SignInPage(gitHubPage);

        await gitHubSigInPage.fields.gitHubEmail.waitFor({ state: 'visible', timeout: 60000 });

        expect(gitHubPage.url()).toContain('https://github.com/login');
        await gitHubPage.close();
      });

      await signInPage.fillOutSignInUserDetails('Wrong Username', 'WrongPassword');
      await signInPage.buttons.signIn.click();
      await signInPage.elements.signInErrorContainer.waitFor({ state: 'visible' });
      await expect(signInPage.elements.signInErrorContainer).toHaveText(signInPage.labels.unableToSignIn);
      expect(page.url()).toContain(dashboardPage.routes.login);

      await dashboardPage.gettingStartedContainer.waitFor({ state: 'detached' });
    });
  }

  test('SAAS-T284 - Verify there is no mentioning Okta in email messages @auth', async ({ page }) => {
    const landingPage = new LandingPage(page);
    const signUpPage = new SignUpPage(page);
    const signInPage = new SignInPage(page);
    const organizationPage = new OrganizationPage(page);
    const membersPage = new MembersPage(page);

    await test.step('1. Register new User.', async () => {
      await landingPage.buttons.createAccount.click();
      await signUpPage.fillOutSignUpUserDetails(notRegisteredUser);
      await signUpPage.registerButton.click();
    });

    await test.step('2. Verify that registration email does not contain any mention of Okta.', async () => {
      const activationEmail = await getMailosaurMessage(
        notRegisteredUser.email,
        signUpPage.activateEmailSubject,
      );

      const activationLink = getMessageLinkByText(activationEmail, signUpPage.activateAccount);

      expect(activationEmail.html.body).not.toContain('Okta');
      await deleteMailosaurMessage(activationEmail.id);
      await page.goto(activationLink);
    });

    await test.step('3. Change password, using forgot password functionality.', async () => {
      await page.goto('/');
      await landingPage.buttons.login.click();
      await signInPage.buttons.needHelp.click();
      await signInPage.buttons.forgotPassword.click();
      await signInPage.resetPassword.fields.username.type(notRegisteredUser.email);
      await page.waitForTimeout(2000);
      await signInPage.resetPassword.buttons.reset.click();
    });

    await test.step(
      '4. Verify that forgot password email does not contain any mention of Okta.',
      async () => {
        const forgotPasswordEmail = await getMailosaurMessage(
          notRegisteredUser.email,
          signInPage.labels.emailSubject,
        );

        expect(forgotPasswordEmail.html.body).not.toContain('Okta');
        await deleteMailosaurMessage(forgotPasswordEmail.id);
      },
    );

    await test.step('4. Invite new user to the org.', async () => {
      const adminToken = await portalAPI.getUserAccessToken(
        notRegisteredUser.email,
        notRegisteredUser.password,
      );

      await portalAPI.createOrg(adminToken);
      await page.goto('/');
      await landingPage.buttons.login.click();
      await signInPage.uiLogin(notRegisteredUser.email, notRegisteredUser.password);
      await signInPage.sideMenu.mainMenu.organization.click();
      await organizationPage.membersTab.click();
      await membersPage.membersTable.inviteMembers.inviteMember(invitedUser.email);
    });

    await test.step('5. Verify that invite user email does not contain any mention of Okta.', async () => {
      const forgotPasswordEmail = await getMailosaurMessage(
        invitedUser.email,
        'Welcome to Test Organization',
      );

      expect(forgotPasswordEmail.html.body).not.toContain('Okta');
      await deleteMailosaurMessage(forgotPasswordEmail.id);
    });
  });

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
        await signInPage.fields.email.waitFor({ state: 'visible' });
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

      await expect(newPage).toHaveTitle('Privacy Central - Securiti.ai');
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
      await expect(signInPage.buttons.needHelp).toHaveText(signInPage.labels.needHelp, {
        timeout: Duration.OneMinute,
      });
    });

    await test.step('2. Click on "Need help signing in?" link', async () => {
      await signInPage.buttons.needHelp.click();
      await expect(signInPage.buttons.forgotPassword).toHaveText(signInPage.labels.forgotPassword);
    });

    await test.step('3. Click on "Forgot password?" link', async () => {
      await signInPage.buttons.forgotPassword.click();
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
        await signInPage.resetPassword.buttons.backButton.click();
        await signInPage.fields.email.waitFor({ state: 'visible' });
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
