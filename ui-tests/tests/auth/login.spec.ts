import { expect, test } from '@playwright/test';
import { DashboardPage } from '@pages/dashboard.page';
import { SignInPage } from '@pages/signIn.page';
import User from '@support/types/user.interface';
import { oktaAPI } from '@api/okta';
import { getUser } from '@helpers/portalHelper';

test.describe('Spec file for dashboard tests for customers', async () => {
  let adminUser: User;

  test.beforeAll(async () => {
    adminUser = getUser();
    await oktaAPI.createUser(adminUser, true);
  });

  test.afterAll(async () => {
    await oktaAPI.deleteUserByEmail(adminUser.email);
  });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
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
    expect(page.url()).toContain('/login');
    await page.goto('/organization');
    await signInPage.signInContainer.waitFor({ state: 'visible' });
    expect(page.url()).toContain('/login');
  });

  test('SAAS-T82 Verify successful login on Percona Portal @login @auth', async ({ page, baseURL }) => {
    const signInPage = new SignInPage(page);
    const dashboardPage = new DashboardPage(page);

    await signInPage.fillOutSignInUserDetails(adminUser.email, adminUser.password);
    await signInPage.signInButton.click();
    await signInPage.waitForPortalLoaded();
    expect(page.url()).toContain(baseURL);

    await dashboardPage.locators.gettingStartedContainer.waitFor({ state: 'visible' });
  });

  test('SAAS-T86 Verify unsuccessful login on Percona Portal @login @auth', async ({ page }) => {
    const signInPage = new SignInPage(page);
    const dashboardPage = new DashboardPage(page);

    await signInPage.fillOutSignInUserDetails('Wrong Username', 'WrongPassword');
    await signInPage.signInButton.click();
    await signInPage.signInErrorContainer.waitFor({ state: 'visible' });
    expect(await signInPage.signInErrorContainer.textContent()).toEqual(signInPage.unableToSignIn);
    expect(page.url()).toContain('/login');

    await dashboardPage.locators.gettingStartedContainer.waitFor({ state: 'detached' });
  });
});
