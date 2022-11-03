import { test, expect, Page } from '@playwright/test';
import { oktaAPI, portalAPI, serviceNowAPI } from '@tests/api';
import User from '@support/types/user.interface';
import ServiceNowResponse from '@support/types/serviceNowResponse.interface';
import { getUser } from '@helpers/portalHelper';
import { DashboardPage } from '@tests/pages/dashboard.page';
import { SignInPage } from '@tests/pages/signIn.page';
import { routeHelper } from '@api/helpers';
import { endpoints } from '@tests/helpers/apiHelper';
import { OrganizationPage } from '@tests/pages/organization.page';
import { MembersPage } from '@tests/pages/members.page';
import { UserRoles } from '@tests/support/enums/userRoles';

test.describe('Spec file for percona customers entitlements tests', async () => {
  const defaultNumberOfEntitlements = 3;
  let customerFirstAdmin: User;
  let customerSecondAdmin: User;
  let customerTechnical: User;
  let notCustomerUser: User;
  let adminToken: string;

  test.beforeEach(async ({ page }) => {
    const serviceNowCredentials: ServiceNowResponse = await serviceNowAPI.createServiceNowCredentials();

    customerFirstAdmin = getUser(serviceNowCredentials.contacts.admin1.email);
    customerSecondAdmin = getUser(serviceNowCredentials.contacts.admin2.email);
    customerTechnical = getUser(serviceNowCredentials.contacts.technical.email);
    notCustomerUser = getUser();

    await oktaAPI.createUser(customerFirstAdmin, true);
    await oktaAPI.createUser(customerSecondAdmin, true);
    await oktaAPI.createUser(customerTechnical, true);
    await oktaAPI.createUser(notCustomerUser, true);

    adminToken = await portalAPI.getUserAccessToken(customerFirstAdmin.email, customerFirstAdmin.password);
    await page.goto('/');
  });

  test.afterEach(async () => {
    const org = await portalAPI.getOrg(adminToken);

    if (org.orgs.length) {
      await portalAPI.deleteOrg(adminToken, org.orgs[0].id);
    }

    await oktaAPI.deleteUserByEmail(customerFirstAdmin.email);
    await oktaAPI.deleteUserByEmail(customerSecondAdmin.email);
    await oktaAPI.deleteUserByEmail(customerTechnical.email);
    await oktaAPI.deleteUserByEmail(notCustomerUser.email);
  });

  test('SAAS-T210 - Verify user with invalid credentials can not see entitlements for his Org @customers @dashboard @entitlements', async ({
    page,
    context,
  }) => {
    test.info().annotations.push(
      {
        type: 'Also Covers',
        description: 'SAAS-T186 - Verify OrgAdmin user can see entitlements for his Org',
      },
      {
        type: 'Also Covers',
        description: 'SAAS-T192 - Verify user with expired Access token can not see entitlements for his Org',
      },
    );

    let secondPage: Page;
    const signInPage = new SignInPage(page);
    const dashboardPage = new DashboardPage(page);

    await oktaAPI.loginByOktaApi(customerFirstAdmin, page);

    await test.step('1. Logout from Portal in one tab', async () => {
      secondPage = await context.newPage();
      const secondDashboard = new DashboardPage(secondPage);

      await secondPage.goto('/');
      await secondDashboard.uiUserLogout();
      await secondPage.close();
    });

    await test.step('2. In first tab user should be asked to login on Portal to see info', async () => {
      await signInPage.emailInput.waitFor({ state: 'visible' });
    });

    await test.step('2. Login on Portal and check Entitlements', async () => {
      await oktaAPI.loginByOktaApi(customerFirstAdmin, page);
      await expect(dashboardPage.entitlementsModal.elements.numberEntitlements).toHaveText(
        String(defaultNumberOfEntitlements),
      );
      await dashboardPage.entitlementsModal.elements.entitlementsButton.click();
      await dashboardPage.entitlementsModal.elements.body.waitFor({ state: 'visible' });
      await expect(dashboardPage.entitlementsModal.elements.entitlementContainer).toHaveCount(
        defaultNumberOfEntitlements,
      );
      await dashboardPage.entitlementsModal.buttons.close.click();
    });
  });

  test('SAAS-T212 - Verify OrgAdmin user can see empty entitlements list for his Org @customers @dashboard @entitlements', async ({
    page,
  }) => {
    const dashboardPage = new DashboardPage(page);

    await oktaAPI.loginByOktaApi(customerFirstAdmin, page);
    await dashboardPage.toast.checkToastMessage(dashboardPage.customerOrgCreated);
    await routeHelper.interceptBackEndCall(page, endpoints.listEntitlements, {
      entitlements: [],
    });
    await page.reload();

    test.step(
      '1. Navigate to Entitlements details on Portal and verify no entitlements are displayed for the user.',
      async () => {
        await expect(dashboardPage.entitlementsModal.elements.numberEntitlements).toHaveText('0');
        await dashboardPage.entitlementsModal.elements.entitlementsButton.waitFor({ state: 'detached' });
      },
    );
  });

  test('SAAS-T231 - Verify non-customer user is not able to see entitlements for the Percona customer organization @customers @dashboard @entitlements', async ({
    page,
  }) => {
    const dashboardPage = new DashboardPage(page);
    const membersPage = new MembersPage(page);
    const organizationPage = new OrganizationPage(page);
    const signInPage = new SignInPage(page);

    await test.step(
      '1. Navigate to the Members tab and invite user not in SN to the Percona Customer organization',
      async () => {
        await oktaAPI.loginByOktaApi(customerFirstAdmin, page);
        await dashboardPage.toast.checkToastMessage(dashboardPage.customerOrgCreated);
        await dashboardPage.sideMenu.mainMenu.organization.click();
        await organizationPage.locators.membersTab.click();
        await membersPage.membersTable.inviteMembers.inviteMember(notCustomerUser.email, UserRoles.admin);
        await membersPage.membersTable.verifyUserMembersTable(notCustomerUser, UserRoles.admin);
        await membersPage.uiUserLogout();
      },
    );

    await test.step('2. Log in as invited user not in SN and check the dashboard', async () => {
      await signInPage.emailInput.waitFor({ state: 'visible' });
      await oktaAPI.loginByOktaApi(notCustomerUser, page);

      await dashboardPage.contacts.accountLoadingSpinner.waitFor({ state: 'detached' });

      await expect(dashboardPage.entitlementsModal.elements.entitlementsRow).toBeHidden();
      await expect(dashboardPage.entitlementsModal.elements.numberEntitlements).toBeHidden();
      await expect(dashboardPage.entitlementsModal.elements.entitlementsButton).toBeHidden();
    });
  });
});
