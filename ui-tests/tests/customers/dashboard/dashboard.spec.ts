import { test, expect } from '@playwright/test';
import { getUser } from '@cypress/pages/auth/getUser';
import { DashboardPage } from '@pages/dashboard.page';
import { UserRoles } from '@support/enums/userRoles';
import { oktaAPI, portalAPI, serviceNowAPI } from '@tests/api';
import User from '@support/types/user.interface';
import ServiceNowResponse from '@support/types/serviceNowResponse.interface';
import { routeHelper } from '@api/helpers';

test.describe('Spec file for dashboard tests for customers', async () => {
  let customerAdmin1User: User;
  let customerAdmin2User: User;
  let customerTechnicalUser: User;
  const users: User[] = [];
  let adminToken: string;

  test.beforeEach(async () => {
    const serviceNowCredentials: ServiceNowResponse = await serviceNowAPI.createServiceNowCredentials();

    customerAdmin1User = await getUser(serviceNowCredentials.contacts.admin1.email);
    customerAdmin2User = await getUser(serviceNowCredentials.contacts.admin2.email);
    customerTechnicalUser = await getUser(serviceNowCredentials.contacts.technical.email);

    await oktaAPI.createUser(customerAdmin1User, true);
    await oktaAPI.createUser(customerAdmin2User, true);
    await oktaAPI.createUser(customerTechnicalUser, true);
    users.push(customerAdmin1User, customerAdmin2User, customerTechnicalUser);
    adminToken = await portalAPI.getUserAccessToken(customerAdmin1User.email, customerAdmin1User.password);
  });

  test.beforeEach(async ({ page }) => {
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

  test('SAAS-T194 - Verify user is able to see empty list if there are no tickets on ServiceNow @dashboardTests', async ({
    page,
  }) => {
    await routeHelper.interceptBackEndCall(page, '**/tickets:search', { tickets: [] });

    await oktaAPI.loginByOktaApi(users[0], page);

    const dashboardPage = new DashboardPage(page);

    await dashboardPage.toast.checkToastMessage(dashboardPage.customerOrgCreated);
    await dashboardPage.locators.emptyTicketTable.waitFor({ state: 'visible', timeout: 60000 });
  });

  test('SAAS-T233 - Verify "open new ticket" link for Percona customer Admin User @dashboardTests', async ({
    page,
  }) => {
    const dashboardPage = new DashboardPage(page);

    await oktaAPI.loginByOktaApi(customerAdmin1User, page);
    await dashboardPage.locators.ticketTable.waitFor({ state: 'visible', timeout: 60000 });
    await dashboardPage.verifyOpenNewTicketButton();
    await dashboardPage.uiUserLogout();
  });

  test('SAAS-T233 - Verify "open new ticket" link for Percona customer Technical User @dashboardTests', async ({
    page,
  }) => {
    const dashboardPage = new DashboardPage(page);

    await portalAPI.createOrg(adminToken);
    await oktaAPI.loginByOktaApi(customerTechnicalUser, page);
    await dashboardPage.locators.ticketTable.waitFor({ state: 'visible', timeout: 60000 });
    await dashboardPage.verifyOpenNewTicketButton();
    await dashboardPage.uiUserLogout();
  });

  test('SAAS-T234 - Verify free account user is not able to get organization tickets if he is a part of Org linked with SN @dashboardTests', async ({
    page,
  }) => {
    const dashboardPage = new DashboardPage(page);

    const nonSnUser = getUser();

    await oktaAPI.createUser(nonSnUser);
    const snOrg = await portalAPI.createOrg(adminToken, 'SAAS-T234 Org');

    await portalAPI.inviteOrgMember(adminToken, snOrg.org.id, {
      username: nonSnUser.email,
      role: UserRoles.admin,
    });

    await oktaAPI.loginByOktaApi(nonSnUser, page);

    await dashboardPage.locators.ticketSection.waitFor({ state: 'detached', timeout: 10000 });
  });

  test('SAAS-T224 - Verify Percona Customer user is able to view Contacts (dynamic) @customers @dashboard', async ({
    page,
    context,
  }) => {
    await context.grantPermissions(['clipboard-write', 'clipboard-read']);
    await page.goto('');
    await oktaAPI.loginByOktaApi(customerAdmin1User, page);
    const dashboardPage = new DashboardPage(page);

    await dashboardPage.toast.checkToastMessage(dashboardPage.customerOrgCreated);
    const org = await portalAPI.getOrg(adminToken);
    const orgDetails = await portalAPI.getOrgDetails(adminToken, org.orgs[0].id);

    expect(await dashboardPage.locators.emailContactLink.getAttribute('href')).toEqual(
      `mailto:${dashboardPage.labels.contactsHelpEmailCustomer}`,
    );
    await expect(dashboardPage.locators.emailContactLink).toHaveText(
      dashboardPage.labels.contactsHelpEmailCustomer,
    );
    await dashboardPage.locators.customerContactIcon.click();
    await dashboardPage.toast.checkToastMessage(dashboardPage.messages.emailCopiedClipboard);
    const clipboardContent = await page.evaluate(() => navigator.clipboard.readText());

    expect(clipboardContent).toEqual(orgDetails.contacts.customer_success.email);
    expect(await dashboardPage.locators.customerContactName.textContent()).toEqual(
      orgDetails.contacts.customer_success.name,
    );
  });

  test('SAAS-T193 - Verify Percona customer Admin user is able to see tickets created for his org @customers @dashboard', async ({
    page,
    context,
  }) => {
    const dashboardPage = new DashboardPage(page);

    await oktaAPI.loginByOktaApi(customerAdmin1User, page);
    await dashboardPage.toast.checkToastMessage(dashboardPage.customerOrgCreated);
    const org = await portalAPI.getOrg(adminToken);
    const tickets = await portalAPI.getOrgTickets(adminToken, org.orgs[0].id);

    expect(await dashboardPage.locators.tableHeaderCell.count()).toEqual(
      dashboardPage.labels.tableHeaders.length,
    );
    expect(await dashboardPage.locators.tableHeaderCell.allInnerTexts()).toEqual(
      dashboardPage.labels.tableHeaders,
    );
    expect(await dashboardPage.locators.ticketsTableBody.count()).toEqual(1);
    const [newPage] = await Promise.all([
      context.waitForEvent('page'),
      dashboardPage.locators.ticketsTableBody.click(),
    ]);

    expect(newPage.url()).toEqual(tickets.tickets[0].url);
  });

  test('SAAS-T196 - Verify Percona Customer Technical user is able to see tickets created for his org @customers @dashboard', async ({
    page,
    context,
  }) => {
    const dashboardPage = new DashboardPage(page);

    await portalAPI.createOrg(adminToken, 'Customer Org');

    await oktaAPI.loginByOktaApi(customerTechnicalUser, page);
    await dashboardPage.toast.checkToastMessage(dashboardPage.customerOrgCreated);
    const org = await portalAPI.getOrg(adminToken);
    const tickets = await portalAPI.getOrgTickets(adminToken, org.orgs[0].id);

    expect(await dashboardPage.locators.tableHeaderCell.count()).toEqual(
      dashboardPage.labels.tableHeaders.length,
    );
    expect(await dashboardPage.locators.tableHeaderCell.allInnerTexts()).toEqual(
      dashboardPage.labels.tableHeaders,
    );
    expect(await dashboardPage.locators.ticketsTableBody.count()).toEqual(1);
    const [newPage] = await Promise.all([
      context.waitForEvent('page'),
      dashboardPage.locators.ticketsTableBody.click(),
    ]);

    expect(newPage.url()).toEqual(tickets.tickets[0].url);
  });
});
