import { expect, test } from '@playwright/test';
import { serviceNowAPI } from '@api/serviceNow';
import { oktaAPI } from '@api/okta';
import { portalAPI } from '@api/portal';
import { SignInPage } from '@pages/signIn.page';
import ServiceNowResponse from '@support/types/serviceNowResponse.interface';
import User from '@support/types/user.interface';
import { OrganizationPage } from '@pages/organization.page';
import { MembersPage } from '@pages/members.page';
import { UserRoles } from '@support/enums/userRoles';
import { DashboardPage } from '@tests/pages/dashboard.page';

test.describe('Spec file for organization tests for customers', async () => {
  let serviceNowCredentials: ServiceNowResponse;
  let admin1User: User;
  let admin2User: User;
  let technicalUser: User;

  test.beforeEach(async ({ page }) => {
    serviceNowCredentials = await serviceNowAPI.createServiceNowCredentials();

    admin1User = await oktaAPI.createTestUser(serviceNowCredentials.contacts.admin1.email);
    admin2User = await oktaAPI.createTestUser(serviceNowCredentials.contacts.admin2.email);
    technicalUser = await oktaAPI.createTestUser(serviceNowCredentials.contacts.technical.email);
    await page.goto('/');
  });

  test.afterEach(async () => {
    await portalAPI.deleteUserOrgIfExists(admin1User);
    await oktaAPI.deleteUsers([admin1User, admin2User, technicalUser]);
  });

  test('SAAS-T160 organization is created automatically for admin @customers @organizations', async ({
    page,
  }) => {
    test.info().annotations.push(
      {
        type: 'Also Covers',
        description: "SAAS-T255 Verify user's role is displayed on Portal",
      },
      {
        type: 'Also Covers',
        description: 'SAAS-T222 Verify Percona Customer account user is not able to update organization name',
      },
    );
    const signInPage = new SignInPage(page);
    const organizationPage = new OrganizationPage(page);
    const dashboardPage = new DashboardPage(page);

    await test.step('1. Login to the portal.', async () => {
      await signInPage.uiLogin(admin1User.email, admin1User.password);
      await signInPage.toast.checkToastMessage(signInPage.customerOrgCreated);
    });

    await test.step("2. Verify user's role is displayed on Portal", async () => {
      await expect(dashboardPage.accountSection.elements.userRole).toContainText(UserRoles.admin, {
        timeout: 30000,
      });
    });

    await test.step('3. Verify user org is created automatically for the customer.', async () => {
      await signInPage.sideMenu.mainMenu.organization.click();
      await organizationPage.elements.orgName.waitFor({ state: 'visible' });

      await expect(organizationPage.elements.orgName).toHaveText(serviceNowCredentials.account.name);
    });

    await test.step('4. Verify Percona customer is not able to update organization name', async () => {
      await organizationPage.elements.manageOrgContainer.waitFor({
        state: 'visible',
        timeout: 10000,
      });
      await organizationPage.buttons.editOrg.waitFor({
        state: 'detached',
        timeout: 10000,
      });
    });
  });

  test('SAAS-T207 Verify Percona Customer technical user can view org already registered on Portal @customers @organizations', async ({
    page,
  }) => {
    test.info().annotations.push(
      {
        type: 'Also Covers',
        description: 'SAAS-T218 Verify Manage Organization view',
      },
      {
        type: 'Also Covers',
        description: 'SAAS-T262 Verify Organization is automatically created for Technical user',
      },
      {
        type: 'Also Covers',
        description: "SAAS-T255 Verify user's role is displayed on Portal",
      },
    );

    const signInPage = new SignInPage(page);
    const organizationPage = new OrganizationPage(page);
    const membersPage = new MembersPage(page);
    const dashboardPage = new DashboardPage(page);

    await test.step('1. Login to the portal.', async () => {
      await signInPage.uiLogin(technicalUser.email, technicalUser.password);
      await organizationPage.toast.checkToastMessage(organizationPage.customerOrgCreated);
    });

    await test.step("2. Verify user's role is displayed on Portal", async () => {
      await expect(dashboardPage.accountSection.elements.userRole).toContainText(UserRoles.admin, {
        timeout: 30000,
      });
    });

    await test.step('3. Navigate to the organization page.', async () => {
      await organizationPage.sideMenu.mainMenu.organization.click();
      await organizationPage.elements.orgName.waitFor({ state: 'visible', timeout: 60000 });
    });

    await test.step('4. Verify org is created for the technical user.', async () => {
      const orgName = await organizationPage.elements.orgName.textContent();

      const technicalToken = await portalAPI.getUserAccessToken(technicalUser.email, technicalUser.password);
      const org = await portalAPI.getOrg(technicalToken);

      expect(orgName).toEqual(org.orgs[0].name);
    });

    // Should be technical due to bug is admin.
    await test.step('5. Verify technical user role.', async () => {
      await organizationPage.organizationTabs.elements.members.click();
      await membersPage.membersTable.verifyUserMembersTable(technicalUser, UserRoles.admin);
    });
  });

  test('SAAS-T218 Verify Manage Organization view @customers @organizations @members', async ({ page }) => {
    const signInPage = new SignInPage(page);
    const organizationPage = new OrganizationPage(page);
    const membersPage = new MembersPage(page);

    await test.step('1. Login to the portal.', async () => {
      await signInPage.uiLogin(technicalUser.email, technicalUser.password);
    });

    await test.step('2. Click on View Organization and check Manage Organization view', async () => {
      await organizationPage.sideMenu.mainMenu.organization.click();
      await organizationPage.elements.manageOrgContainer.waitFor({ state: 'visible' });
    });

    await test.step('3. Verify navigation to members tab', async () => {
      await organizationPage.organizationTabs.elements.members.click();
      await membersPage.container.waitFor({ state: 'visible' });
    });

    await test.step('4. Verify navigation to organization tab', async () => {
      await organizationPage.organizationTabs.elements.organization.click();
      await organizationPage.elements.manageOrgContainer.waitFor({ state: 'visible' });
    });
  });
});
