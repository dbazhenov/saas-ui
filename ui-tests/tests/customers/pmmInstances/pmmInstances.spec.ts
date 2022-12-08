import { expect, test } from '@playwright/test';
import { serviceNowAPI } from '@api/serviceNow';
import { oktaAPI } from '@api/okta';
import { portalAPI } from '@api/portal';
import ServiceNowResponse from '@support/types/serviceNowResponse.interface';
import User from '@support/types/user.interface';
import { getUser } from '@helpers/portalHelper';
import { DashboardPage } from '@tests/pages/dashboard.page';
import PMMInstances from '@tests/pages/PMMInstances.page';

test.describe('Spec file for PMM instances list tests for customers', async () => {
  let admin1User: User;
  let admin2User: User;
  let technicalUser: User;
  let adminToken: string;

  test.beforeEach(async ({ page }) => {
    const serviceNowCredentials: ServiceNowResponse = await serviceNowAPI.createServiceNowCredentials();

    admin1User = getUser(serviceNowCredentials.contacts.admin1.email);
    admin2User = getUser(serviceNowCredentials.contacts.admin2.email);
    technicalUser = getUser(serviceNowCredentials.contacts.technical.email);

    await oktaAPI.createUser(admin1User, true);
    await oktaAPI.createUser(admin2User, true);
    await oktaAPI.createUser(technicalUser, true);
    adminToken = await portalAPI.getUserAccessToken(admin1User.email, admin1User.password);
    await page.goto('/');
  });

  test.afterEach(async () => {
    const org = await portalAPI.getOrg(adminToken);

    if (org.orgs.length) {
      await portalAPI.deleteOrg(adminToken, org.orgs[0].id);
    }

    await oktaAPI.deleteUserByEmail(admin1User.email);
    await oktaAPI.deleteUserByEmail(admin2User.email);
    await oktaAPI.deleteUserByEmail(technicalUser.email);
  });

  test('SAAS-T232 Verify Read-more for Connecting PMM and portal @customers @pmmInstances', async ({
    page,
  }) => {
    const dashboardPage = new DashboardPage(page);
    const pmmInstances = new PMMInstances(page);

    await test.step(
      'Login to the portal, navigate to the pmm instances page. and click on Read-more for Connect your PMM item',
      async () => {
        await oktaAPI.loginByOktaApi(admin1User, page);
        await dashboardPage.sideMenu.mainMenu.pmmInstances.click();
        await pmmInstances.container.waitFor({ state: 'visible' });
      },
    );

    await test.step('Verify Read-more for Connect your PMM item', async () => {
      await expect(pmmInstances.readMore).toHaveAttribute('href', pmmInstances.readMoreLink);
      await expect(pmmInstances.readMore).toHaveText(pmmInstances.readMoreMessage);
    });
  });
});
