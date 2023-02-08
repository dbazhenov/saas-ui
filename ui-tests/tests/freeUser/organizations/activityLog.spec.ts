import { expect, test } from '@playwright/test';
import { DashboardPage } from '@pages/dashboard.page';
import { OrganizationPage } from '@pages/organization.page';
import { UserRoles } from '@support/enums/userRoles';
import User from '@support/types/user.interface';
import { oktaAPI } from '@api/okta';
import { portalAPI } from '@api/portal';
import ActivityLogPage from '@tests/pages/ActivityLog.page';
import LandingPage from '@tests/pages/landing.page';
import { SignInPage } from '@tests/pages/signIn.page';
import { MembersPage } from '@tests/pages/members.page';

test.describe('Spec file for free user activity log tests', async () => {
  let adminUser: User;
  let technicalUser: User;
  let removedUser: User;
  const inventoryName = `Test PMM Server ${Date.now()}`;
  const inventoryId = portalAPI.getRandomPmmServerId();

  test.beforeAll(async () => {
    adminUser = await oktaAPI.createTestUser();
    technicalUser = await oktaAPI.createTestUser();
    removedUser = await oktaAPI.createTestUser();
    adminUser.id = (await oktaAPI.getUserDetailsByEmail(adminUser.email)).data.id;
    technicalUser.id = (await oktaAPI.getUserDetailsByEmail(technicalUser.email)).data.id;
    removedUser.id = (await oktaAPI.getUserDetailsByEmail(removedUser.email)).data.id;
    const adminToken = await portalAPI.getUserAccessToken(adminUser.email, adminUser.password);
    const { org } = await portalAPI.createOrg(adminToken);

    await portalAPI.inviteUserToOrg(adminToken, org.id, technicalUser.email, UserRoles.technical);
    await portalAPI.inviteUserToOrg(adminToken, org.id, removedUser.email, UserRoles.technical);
    await portalAPI.connectInventory(adminToken, {
      pmmServerId: inventoryId,
      pmmServerName: inventoryName,
    });
    await portalAPI.disconnectInventory(adminToken, inventoryId);
  });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.afterAll(async () => {
    await portalAPI.deleteUserOrgIfExists(adminUser);
    await oktaAPI.deleteUsers([adminUser, technicalUser, removedUser]);
  });

  test('SAAS-T276 - Verify that Org admin can see events from their organization in Activity log @freeUser @organizations', async ({
    page,
  }) => {
    const landingPage = new LandingPage(page);
    const signInPage = new SignInPage(page);
    const organizationPage = new OrganizationPage(page);
    const activityLogPage = new ActivityLogPage(page);
    const membersPage = new MembersPage(page);

    await test.step('1. Login to portal and navigate to activity log', async () => {
      await landingPage.buttons.login.click();
      await signInPage.uiLogin(adminUser.email, adminUser.password);
      await organizationPage.sideMenu.mainMenu.organization.click();
      await organizationPage.membersTab.click();
      await membersPage.membersTable.deleteUserByEmail(removedUser.email);
      await organizationPage.activityLogTab.click();
    });

    await test.step('3. Verify log for creating organization is present in activity log', async () => {
      await activityLogPage.activityLogTable.getRowByText(
        activityLogPage.activityLogTable.messages.orgCreated(adminUser.id, 'Test Organization'),
        'Details',
      );
    });

    await test.step('4. Verify log for inviting user is present in activity log', async () => {
      await activityLogPage.activityLogTable.getRowByText(
        activityLogPage.activityLogTable.messages.userAdded(adminUser.id, removedUser.id),
        'Details',
      );
    });

    await test.step('4. Verify log for deleting user is present in activity log', async () => {
      await activityLogPage.activityLogTable.getRowByText(
        activityLogPage.activityLogTable.messages.userDeleted(adminUser.id, removedUser.id),
        'Details',
      );
    });

    await test.step('4. Verify log for connecting is present in activity log', async () => {
      await activityLogPage.activityLogTable.getRowByText(
        activityLogPage.activityLogTable.messages.inventoryCreated(adminUser.id, inventoryName),
        'Details',
      );
    });

    await test.step('5. Verify log for disconnecting pmm is present in activity log', async () => {
      await activityLogPage.activityLogTable.getRowByText(
        activityLogPage.activityLogTable.messages.inventoryDeleted(adminUser.id, inventoryName),
        'Details',
      );
    });
  });

  test("SAAS-T277 Verify the org technical user can't see Activity log @freeUser @organizations", async ({
    page,
  }) => {
    const dashboardPage = new DashboardPage(page);

    const organizationPage = new OrganizationPage(page);

    await test.step('Login to portal and navigate to organization page', async () => {
      await oktaAPI.loginByOktaApi(technicalUser, page);
      await dashboardPage.sideMenu.mainMenu.organization.click();
    });

    await test.step('Verify there is not activity log btn', async () => {
      await organizationPage.deleteOrgButton.waitFor({ state: 'visible' });
      await expect(organizationPage.activityLogTab).not.toBeVisible();
    });
  });
});
