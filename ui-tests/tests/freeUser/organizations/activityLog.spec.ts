import { expect, test } from '@playwright/test';
import { DashboardPage } from '@pages/dashboard.page';
import { OrganizationPage } from '@pages/organization.page';
import { UserRoles } from '@support/enums/userRoles';
import User from '@support/types/user.interface';
import { oktaAPI } from '@api/okta';
import { portalAPI } from '@api/portal';
import { getUser } from '@helpers/portalHelper';

test.describe('Spec file for free user activity log tests', async () => {
  let newAdmin1User: User;
  let newTechnicalUser: User;
  let adminToken: string;
  let org: any;

  test.beforeEach(async ({ page }) => {
    newAdmin1User = getUser();
    newTechnicalUser = getUser();

    await oktaAPI.createUser(newAdmin1User, true);
    await oktaAPI.createUser(newTechnicalUser, true);
    adminToken = await portalAPI.getUserAccessToken(newAdmin1User.email, newAdmin1User.password);
    const newOrg = await portalAPI.createOrg(adminToken);

    org = newOrg.org;

    await portalAPI.inviteOrgMember(adminToken, org.id, {
      username: newTechnicalUser.email,
      role: UserRoles.technical,
    });

    await page.goto('/');
  });

  test.afterEach(async () => {
    const afterTestOrg = await portalAPI.getOrg(adminToken);

    if (afterTestOrg.orgs.length) {
      await portalAPI.deleteOrg(adminToken, afterTestOrg.orgs[0].id);
    }

    await oktaAPI.deleteUserByEmail(newAdmin1User.email);
    await oktaAPI.deleteUserByEmail(newTechnicalUser.email);
  });

  test("SAAS-T277 Verify the org technical user can't see Activity log @freeUser @organizations", async ({
    page,
  }) => {
    const dashboardPage = new DashboardPage(page);

    const organizationPage = new OrganizationPage(page);

    await test.step('Login to portal and navigate to organization page', async () => {
      await oktaAPI.loginByOktaApi(newTechnicalUser, page);
      await dashboardPage.sideMenu.mainMenu.organization.click();
    });

    await test.step('Verify there is not activity log btn', async () => {
      await organizationPage.deleteOrgButton.waitFor({ state: 'visible' });
      await expect(organizationPage.activityLogTab).not.toBeVisible();
    });
  });
});
