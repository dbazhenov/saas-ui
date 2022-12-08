import { expect, test } from '@playwright/test';
import { DashboardPage } from '@pages/dashboard.page';
import { SignInPage } from '@pages/signIn.page';
import User from '@support/types/user.interface';
import { oktaAPI } from '@api/okta';
import { getUser } from '@helpers/portalHelper';

test.describe('Spec file for dashboard tests for customers', async () => {
  let adminUser: User;

  test.beforeEach(async ({ page }) => {
    adminUser = getUser();
    await oktaAPI.createUser(adminUser, true);
    await page.goto('/');
  });

  test.afterEach(async () => {
    if (await oktaAPI.getUser(adminUser.email)) {
      await oktaAPI.deleteUserByEmail(adminUser.email);
    }
  });

  test('SAAS-T251 - Verify handling of status 401 @auth', async ({ page }) => {
    const signInPage = new SignInPage(page);
    const dashboardPage = new DashboardPage(page);

    await oktaAPI.loginByOktaApi(adminUser, page);
    await dashboardPage.contacts.accountLoadingSpinner.waitFor({ state: 'detached' });
    await dashboardPage.contacts.contactsLoadingSpinner.waitFor({ state: 'detached' });

    await oktaAPI.deleteUserByEmail(adminUser.email);
    await page.reload();
    await signInPage.signInContainer.waitFor({ state: 'visible' });
    expect(page.url()).toContain(dashboardPage.routes.login);
    await page.goto(dashboardPage.routes.organization);
    await signInPage.signInContainer.waitFor({ state: 'visible' });
    expect(page.url()).toContain(dashboardPage.routes.login);
  });

  test('SAAS-T82 Verify successful login on Percona Portal @login @auth', async ({ page, baseURL }) => {
    const signInPage = new SignInPage(page);
    const dashboardPage = new DashboardPage(page);

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

      await test.step('SAAS-T245 Verify user is able to see "Continue with.." buttons', async () => {
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
});
