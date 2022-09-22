import { expect, test } from '@playwright/test';
import { serviceNowAPI } from '@api/serviceNow';
import { oktaAPI } from '@api/okta';
import { portalAPI } from '@api/portal';
import { getUser } from '@cypress/pages/auth/getUser';
import { SignInPage } from '@pages/signIn.page';
import ServiceNowResponse from '@support/types/serviceNowResponse.interface';
import User from '@support/types/user.interface';
import { OrganizationPage } from '@pages/organization.page';
import { MembersPage } from '@pages/members.page';
import { UserRoles } from '@support/enums/userRoles';

test.describe('Spec file for organization tests for customers', async () => {
  let serviceNowCredentials: ServiceNowResponse;
  let customerAdmin1User: User;
  let customerAdmin2User: User;
  let customerTechnicalUser: User;
  let adminToken: string;

  test.beforeAll(async () => {
    serviceNowCredentials = await serviceNowAPI.createServiceNowCredentials();

    customerAdmin1User = await getUser(serviceNowCredentials.contacts.admin1.email);
    customerAdmin2User = await getUser(serviceNowCredentials.contacts.admin2.email);
    customerTechnicalUser = await getUser(serviceNowCredentials.contacts.technical.email);

    await oktaAPI.createUser(customerAdmin1User, true);
    await oktaAPI.createUser(customerAdmin2User, true);
    await oktaAPI.createUser(customerTechnicalUser, true);
    adminToken = await portalAPI.getUserAccessToken(customerAdmin1User.email, customerAdmin1User.password);
  });

  test.afterAll(async () => {
    const org = await portalAPI.getOrg(adminToken);

    if (org.orgs.length) {
      await portalAPI.deleteOrg(adminToken, org.orgs[0].id);
    }

    await oktaAPI.deleteUserByEmail(customerAdmin1User.email);
    await oktaAPI.deleteUserByEmail(customerAdmin2User.email);
    await oktaAPI.deleteUserByEmail(customerTechnicalUser.email);
  });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('SAAS-T160 organization is created automatically for admin @customers @organizations', async ({
    page,
  }) => {
    const signInPage = new SignInPage(page);
    const organizationPage = new OrganizationPage(page);

    await oktaAPI.loginByOktaApi(customerAdmin1User, page);

    await signInPage.toast.checkToastMessage(signInPage.customerOrgCreated);
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
    test.info().annotations.push({
      type: 'Also Covers',
      description: 'SAAS-T218 Verify Manage Organization view',
    });
    const organizationPage = new OrganizationPage(page);
    const membersPage = new MembersPage(page);

    await oktaAPI.loginByOktaApi(customerTechnicalUser, page);

    await organizationPage.sideMenu.mainMenu.organization.click();
    await organizationPage.locators.organizationName.waitFor({ state: 'visible', timeout: 60000 });
    await organizationPage.toast.checkToastMessage(organizationPage.customerOrgCreated);
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
