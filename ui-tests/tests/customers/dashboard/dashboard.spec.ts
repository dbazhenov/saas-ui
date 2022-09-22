import { expect, test } from '@playwright/test';
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

  test('SAAS-T194 - Verify user is able to see empty list if there are no tickets on ServiceNow @customers @dashboard', async ({
    page,
  }) => {
    const dashboardPage = new DashboardPage(page);

    await routeHelper.interceptBackEndCall(page, '**/tickets:search', { tickets: [] });
    await oktaAPI.loginByOktaApi(users[0], page);
    await dashboardPage.toast.checkToastMessage(dashboardPage.customerOrgCreated);
    await dashboardPage.ticketTable.emptyTable.waitFor({ state: 'visible', timeout: 60000 });

    await test.step(
      'SAAS-T247 - Verify user with Percona customer organization can see the tickets overview on Portal',
      async () => {
        await test.step('Navigate to Portal and wait for ticket overview to display.', async () => {
          await routeHelper.interceptBackEndCall(page, '**/tickets:search', {
            tickets: dashboardPage.ticketOverview.tickets,
          });
          await page.reload();
          await dashboardPage.ticketOverview.ticketOverviewContainer.waitFor({
            state: 'visible',
            timeout: 60000,
          });
        });

        await test.step(
          'Verify user can see Ticket Overview section with amount of tickets and divided  by categories.',
          async () => {
            const ticketsDepartment: string[] = dashboardPage.ticketOverview.tickets.map(
              (ticket) => ticket.department,
            );

            await expect(dashboardPage.ticketOverview.departmentName).toHaveCount(ticketsDepartment.length);
            await expect(dashboardPage.ticketOverview.departmentTicketCount).toHaveText(['1', '1', '1']);
            await expect(dashboardPage.ticketOverview.totalTicketNumber).toHaveText(
              dashboardPage.ticketOverview.tickets.length.toString(),
            );
          },
        );
      },
    );
  });

  test('SAAS-T233 - Verify "open new ticket" link for Percona customer Admin User @customers @dashboard', async ({
    page,
  }) => {
    const dashboardPage = new DashboardPage(page);

    await oktaAPI.loginByOktaApi(customerAdmin1User, page);
    await dashboardPage.ticketTable.table.waitFor({ state: 'visible', timeout: 60000 });

    await dashboardPage.verifyOpenNewTicketButton();
  });

  test('SAAS-T233 - Verify "open new ticket" link for Percona customer Technical User @customers @dashboard', async ({
    page,
  }) => {
    const dashboardPage = new DashboardPage(page);

    await portalAPI.createOrg(adminToken);
    await oktaAPI.loginByOktaApi(customerTechnicalUser, page);
    await dashboardPage.ticketTable.table.waitFor({ state: 'visible', timeout: 60000 });

    await dashboardPage.verifyOpenNewTicketButton();
    await dashboardPage.uiUserLogout();
  });

  test('SAAS-T234 - Verify free account user is not able to get organization tickets if he is a part of Org linked with SN @customers @dashboard', async ({
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

    expect(await dashboardPage.contacts.emailContactLink.getAttribute('href')).toEqual(
      `mailto:${dashboardPage.contacts.contactsHelpEmailCustomer}`,
    );
    await expect(dashboardPage.contacts.emailContactLink).toHaveText(
      dashboardPage.contacts.contactsHelpEmailCustomer,
    );
    await dashboardPage.contacts.customerContactIcon.click();
    await dashboardPage.toast.checkToastMessage(dashboardPage.messages.emailCopiedClipboard);
    const clipboardContent = await page.evaluate(() => navigator.clipboard.readText());

    expect(clipboardContent).toEqual(orgDetails.contacts.customer_success.email);
    expect(await dashboardPage.contacts.customerContactName.textContent()).toEqual(
      orgDetails.contacts.customer_success.name,
    );
  });

  test('SAAS-T193 - Verify Percona customer Admin user is able to see tickets created for his org @customers @dashboard', async ({
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
    const numberOfEntitlements = 3;
    const dashboardPage = new DashboardPage(page);

    await oktaAPI.loginByOktaApi(customerAdmin1User, page);
    await dashboardPage.toast.checkToastMessage(dashboardPage.customerOrgCreated);
    await expect(dashboardPage.entitlementsModal.numberEntitlements).toHaveText(String(numberOfEntitlements));
    await dashboardPage.entitlementsModal.entitlementsButton.click();
    await dashboardPage.entitlementsModal.modalWindow.modalBody.waitFor({ state: 'visible' });
    await expect(dashboardPage.entitlementsModal.entitlementContainer).toHaveCount(numberOfEntitlements);
    await dashboardPage.entitlementsModal.modalWindow.closeModalButton.click();

    const org = await portalAPI.getOrg(adminToken);
    const tickets = await portalAPI.getOrgTickets(adminToken, org.orgs[0].id);

    await expect(dashboardPage.ticketTable.tableHeaderCell).toHaveCount(
      Object.keys(dashboardPage.ticketTable.tableHeaders()).length,
    );
    await expect(dashboardPage.ticketTable.tableHeaderCell).toHaveText(
      Object.values(dashboardPage.ticketTable.tableHeaders()),
    );

    expect(await dashboardPage.ticketTable.tableBody.count()).toEqual(1);
    const [newPage] = await Promise.all([
      context.waitForEvent('page'),
      dashboardPage.ticketTable.tableBody.click(),
    ]);

    expect(newPage.url()).toEqual(tickets.tickets[0].url);
    await newPage.close();
    const secondTab = await context.newPage();
    const dashboardPageSecondTab = new DashboardPage(secondTab);

    await secondTab.goto('/');
    await dashboardPageSecondTab.waitForPortalLoaded();
    await dashboardPageSecondTab.uiUserLogout();
    await page.reload();
    expect(page.url()).toContain('/login');
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

    await expect(dashboardPage.ticketTable.tableHeaderCell).toHaveCount(
      Object.keys(dashboardPage.ticketTable.tableHeaders()).length,
    );
    await expect(dashboardPage.ticketTable.tableHeaderCell).toHaveText(
      Object.values(dashboardPage.ticketTable.tableHeaders()),
    );
    expect(await dashboardPage.ticketTable.tableBody.count()).toEqual(1);
    const [newPage] = await Promise.all([
      context.waitForEvent('page'),
      dashboardPage.ticketTable.tableBody.click(),
    ]);

    expect(newPage.url()).toEqual(tickets.tickets[0].url);
  });
});
