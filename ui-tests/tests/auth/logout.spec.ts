import { test } from '@playwright/test';
import { oktaAPI } from '@api/okta';
import { DashboardPage } from '@pages/dashboard.page';
import User from '@support/types/user.interface';
import { getUser } from '@helpers/portalHelper';
import LandingPage from '@tests/pages/landing.page';

test.describe('Spec file for dashboard tests for customers', async () => {
  let adminUser: User;

  test.beforeAll(async () => {
    adminUser = getUser();
    await oktaAPI.createUser(adminUser, true);
  });

  test.afterAll(async () => {
    await oktaAPI.deleteUserByEmail(adminUser.email);
  });

  test('SAAS-T80 - should be able to logout @logout @auth', async ({ page }) => {
    await page.goto('/');
    await oktaAPI.loginByOktaApi(adminUser, page);
    const dashboardPage = new DashboardPage(page);

    await dashboardPage.waitForPortalLoaded();
    await dashboardPage.userDropdown.logoutUser();
    const landingPage = new LandingPage(page);

    await landingPage.landingPageContainer.waitFor({ state: 'visible' });
  });
});
