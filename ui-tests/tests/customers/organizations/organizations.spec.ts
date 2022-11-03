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
import { getUser } from '@helpers/portalHelper';
import { DashboardPage } from '@tests/pages/dashboard.page';

test.describe('Spec file for organization tests for customers', async () => {
  let serviceNowCredentials: ServiceNowResponse;
  let customerAdmin1User: User;
  let customerAdmin2User: User;
  let customerTechnicalUser: User;
  let adminToken: string;

  test.beforeEach(async ({ page }) => {
    serviceNowCredentials = await serviceNowAPI.createServiceNowCredentials();

    customerAdmin1User = getUser(serviceNowCredentials.contacts.admin1.email);
    customerAdmin2User = getUser(serviceNowCredentials.contacts.admin2.email);
    customerTechnicalUser = getUser(serviceNowCredentials.contacts.technical.email);

    await oktaAPI.createUser(customerAdmin1User, true);
    await oktaAPI.createUser(customerAdmin2User, true);
    await oktaAPI.createUser(customerTechnicalUser, true);
    adminToken = await portalAPI.getUserAccessToken(customerAdmin1User.email, customerAdmin1User.password);
    await page.goto('/');
  });

  test.afterEach(async () => {
    const org = await portalAPI.getOrg(adminToken);

    if (org.orgs.length) {
      await portalAPI.deleteOrg(adminToken, org.orgs[0].id);
    }

    await oktaAPI.deleteUserByEmail(customerAdmin1User.email);
    await oktaAPI.deleteUserByEmail(customerAdmin2User.email);
    await oktaAPI.deleteUserByEmail(customerTechnicalUser.email);
  });

  test('SAAS-T160 organization is created automatically for admin @customers @organizations', async ({
    page,
  }) => {
    const signInPage = new SignInPage(page);
    const organizationPage = new OrganizationPage(page);
    const dashboardPage = new DashboardPage(page);

    await oktaAPI.loginByOktaApi(customerAdmin1User, page);

    await signInPage.toast.checkToastMessage(signInPage.customerOrgCreated);

    await test.step("SAAS-T255 Verify user's role is displayed on Portal", async () => {
      await expect(dashboardPage.accountSection.elements.userRole).toContainText(UserRoles.admin, {
        timeout: 30000,
      });
    });
    await signInPage.sideMenu.mainMenu.organization.click();
    await organizationPage.locators.organizationName.waitFor({ state: 'visible' });

    await expect(organizationPage.locators.organizationName).toHaveText(serviceNowCredentials.account.name);
  });

  test('SAAS-T222 Verify Percona Customer account user is not able to update organization name @customers @organizations', async ({
    page,
  }) => {
    const signInPage = new SignInPage(page);
    const organizationPage = new OrganizationPage(page);

    await oktaAPI.loginByOktaApi(customerAdmin1User, page);

    await signInPage.toast.checkToastMessage(signInPage.customerOrgCreated);
    await signInPage.sideMenu.mainMenu.organization.click();

    await organizationPage.locators.manageOrganizationContainer.waitFor({
      state: 'visible',
      timeout: 10000,
    });
    await organizationPage.locators.editOrgButton.waitFor({
      state: 'detached',
      timeout: 10000,
    });
  });

  // Defect Here
  test.skip('SAAS-T207 Verify Percona Customer technical user can view org already registered on Portal @customers @organizations', async ({
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
    );
    const organizationPage = new OrganizationPage(page);
    const membersPage = new MembersPage(page);
    const dashboardPage = new DashboardPage(page);

    await oktaAPI.loginByOktaApi(customerTechnicalUser, page);

    await organizationPage.toast.checkToastMessage(organizationPage.customerOrgCreated);

    await test.step("SAAS-T255 Verify user's role is displayed on Portal", async () => {
      await expect(dashboardPage.accountSection.elements.userRole).toContainText(UserRoles.admin, {
        timeout: 30000,
      });
    });

    await organizationPage.sideMenu.mainMenu.organization.click();
    await organizationPage.locators.organizationName.waitFor({ state: 'visible', timeout: 60000 });
    const orgName = await organizationPage.locators.organizationName.textContent();

    const technicalToken = await portalAPI.getUserAccessToken(
      customerTechnicalUser.email,
      customerTechnicalUser.password,
    );
    const org = await portalAPI.getOrg(technicalToken);

    expect(orgName).toEqual(org.orgs[0].name);
    await organizationPage.locators.membersTab.click();

    await membersPage.membersTable.verifyUserMembersTable(customerTechnicalUser, UserRoles.technical);
  });
});
