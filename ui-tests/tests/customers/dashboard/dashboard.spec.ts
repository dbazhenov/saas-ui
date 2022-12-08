import { test, expect } from '@playwright/test';
import { DashboardPage } from '@pages/dashboard.page';
import { UserRoles } from '@support/enums/userRoles';
import { oktaAPI, portalAPI, serviceNowAPI } from '@tests/api';
import User from '@support/types/user.interface';
import ServiceNowResponse from '@support/types/serviceNowResponse.interface';
import { routeHelper } from '@api/helpers';
import { getUser } from '@helpers/portalHelper';
import { endpoints } from '@tests/helpers/apiHelper';

test.describe('Spec file for dashboard tests for customers', async () => {
  let customerAdmin1User: User;
  let customerAdmin2User: User;
  let customerTechnicalUser: User;
  const users: User[] = [];
  let adminToken: string;

  test.beforeEach(async ({ page }) => {
    const serviceNowCredentials: ServiceNowResponse = await serviceNowAPI.createServiceNowCredentials();

    customerAdmin1User = getUser(serviceNowCredentials.contacts.admin1.email);
    customerAdmin2User = getUser(serviceNowCredentials.contacts.admin2.email);
    customerTechnicalUser = getUser(serviceNowCredentials.contacts.technical.email);

    await oktaAPI.createUser(customerAdmin1User, true);
    await oktaAPI.createUser(customerAdmin2User, true);
    await oktaAPI.createUser(customerTechnicalUser, true);
    users.push(customerAdmin1User, customerAdmin2User, customerTechnicalUser);
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

  test('SAAS-T194 - Verify user is able to see empty list if there are no tickets on ServiceNow @customers @dashboard', async ({
    page,
  }) => {
    test.slow();
    const dashboardPage = new DashboardPage(page);

    await routeHelper.interceptBackEndCall(page, endpoints.listTickets, { tickets: [] });
    await oktaAPI.loginByOktaApi(users[0], page);
    await dashboardPage.toast.checkToastMessage(dashboardPage.customerOrgCreated);
    await dashboardPage.ticketTable.emptyTable.waitFor({ state: 'visible', timeout: 60000 });

    await routeHelper.interceptBackEndCall(page, endpoints.listTickets, {
      tickets: dashboardPage.ticketOverview.tickets,
    });
    await page.reload();
    await dashboardPage.ticketOverview.ticketOverviewContainer.waitFor({ state: 'visible', timeout: 60000 });
    const displayedDepartments = await dashboardPage.ticketOverview.departmentName.allTextContents();

    const ticketData = dashboardPage.ticketOverview.tickets.map((ticket) => ticket.department);

    expect(displayedDepartments.sort()).toEqual(ticketData.sort());

    await expect(dashboardPage.ticketOverview.totalTicketNumber).toHaveText(
      dashboardPage.ticketOverview.tickets.length.toString(),
    );

    await dashboardPage.ticketOverview.verifyTicketNumberDepartment('1');
    await dashboardPage.ticketTable.table.waitFor({ state: 'visible' });
    /*

      Blocked due to sorting of table is not functional, will be fixed with MUI migration.

    const ticketHeaders: string[] = await dashboardPage.ticketTable.tableHeaderCell.allTextContents();
    // eslint-disable-next-line no-restricted-syntax
    for await (const [index, header] of ticketHeaders.entries()) {
      if (index > 0) {
        await dashboardPage.ticketTable.tableHeaderSortIcon.nth(index).click();
        await page.waitForTimeout(1000);
      }

      const values = await dashboardPage.ticketTable.getValuesForColumn(header);
    }
*/
  });

  test('SAAS-T264 - Verify pagination for list of tickets @customers @dashboard', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    let tickets;

    await oktaAPI.loginByOktaApi(users[0], page);

    await test.step('Verify that default value for Rows per page is 10', async () => {
      tickets = dashboardPage.ticketOverview.generateNumberOfTickets(101);

      await routeHelper.interceptBackEndCall(page, endpoints.listTickets, {
        tickets,
      });
      await page.reload();
      await page.waitForTimeout(5000);
      await page.mouse.wheel(0, 1000);
      await dashboardPage.ticketTable.table.waitFor({ state: 'visible' });
      await expect(dashboardPage.ticketTable.row).toHaveCount(10);
    });

    await test.step(
      'Verify that there is possibility to select rows per page from the next list of values: 10, 25, 50, 100',
      async () => {
        await dashboardPage.ticketTable.paginationComponent.select.click();
        await expect(dashboardPage.ticketTable.paginationComponent.sizeSelect).toHaveCount(
          dashboardPage.ticketTable.paginationComponent.texts.length,
        );
        await expect(dashboardPage.ticketTable.paginationComponent.sizeSelect).toHaveText(
          dashboardPage.ticketTable.paginationComponent.texts.map(String),
        );
      },
    );

    await test.step(
      'Select 25 and verify that the only 25 tickets is displayed on the first page',
      async () => {
        await dashboardPage.ticketTable.verifyPagination(25);
      },
    );

    await test.step(
      'Select 50 and verify that the only 50 tickets is displayed on the first page',
      async () => {
        await dashboardPage.ticketTable.paginationComponent.select.click();
        await dashboardPage.ticketTable.verifyPagination(50);
      },
    );

    await test.step(
      'Select 100 and verify that the only 100 tickets is displayed on the first page',
      async () => {
        await dashboardPage.ticketTable.paginationComponent.select.click();
        await dashboardPage.ticketTable.verifyPagination(100);
      },
    );

    await test.step('Verify there is pagination button under the list of tickets', async () => {
      await dashboardPage.ticketTable.paginationComponent.select.click();
      await dashboardPage.ticketTable.verifyPagination(10);
      await dashboardPage.ticketTable.paginationComponent.previousPage.waitFor({ state: 'visible' });
      await dashboardPage.ticketTable.paginationComponent.nextPage.waitFor({ state: 'visible' });
    });

    await test.step('Click on "Next" button and Verify that the next page of tickets is opened', async () => {
      await dashboardPage.ticketTable.paginationComponent.nextPage.click();
      await expect(dashboardPage.ticketTable.paginationComponent.intervalLocator).toHaveText(
        dashboardPage.ticketTable.paginationComponent.interval('11', '20', '101'),
      );
      await dashboardPage.ticketTable.verifyRowData(tickets[10], 0);
    });

    await test.step('Click on "Back" button and Verify the first page of tickets is opened', async () => {
      await dashboardPage.ticketTable.paginationComponent.previousPage.click();
      await expect(dashboardPage.ticketTable.paginationComponent.intervalLocator).toHaveText(
        dashboardPage.ticketTable.paginationComponent.interval('1', '10', '101'),
      );
      await dashboardPage.ticketTable.verifyRowData(tickets[0], 0);
    });
  });

  test('SAAS-T247 - Verify user with Percona customer organization can see the tickets overview on Portal @customers @dashboard', async ({
    page,
  }) => {
    const dashboardPage = new DashboardPage(page);

    await test.step('Navigate to Portal and wait for ticket overview to display.', async () => {
      await routeHelper.interceptBackEndCall(page, endpoints.listTickets, {
        tickets: dashboardPage.ticketOverview.tickets,
      });
      await oktaAPI.loginByOktaApi(users[0], page);
      await dashboardPage.ticketOverview.ticketOverviewContainer.waitFor({
        state: 'visible',
        timeout: 60000,
      });
    });

    await test.step(
      'Verify user can see Ticket Overview section with amount of tickets and divided  by categories.',
      async () => {
        await expect(dashboardPage.ticketOverview.departmentName).toHaveCount(
          dashboardPage.ticketOverview.tickets.map((ticket) => ticket.department).length,
        );
        await expect(dashboardPage.ticketOverview.departmentTicketCount).toHaveText(['1', '1', '1']);
        await expect(dashboardPage.ticketOverview.totalTicketNumber).toHaveText(
          dashboardPage.ticketOverview.tickets.length.toString(),
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
    await dashboardPage.userDropdown.logoutUser();
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

    await dashboardPage.ticketSection.waitFor({ state: 'detached', timeout: 10000 });
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

    await expect(dashboardPage.contacts.emailContactLink).toHaveAttribute(
      'href',
      `mailto:${dashboardPage.contacts.contactsHelpEmailCustomer}`,
    );
    await expect(dashboardPage.contacts.emailContactLink).toHaveText(
      dashboardPage.contacts.contactsHelpEmailCustomer,
    );
    await dashboardPage.contacts.customerContactIcon.click();
    await dashboardPage.toast.checkToastMessage(dashboardPage.emailCopiedClipboard);
    const clipboardContent = await page.evaluate(() => navigator.clipboard.readText());

    expect(clipboardContent).toEqual(orgDetails.contacts.customer_success.email);
    await expect(dashboardPage.contacts.customerContactName).toHaveText(
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

    await expect(dashboardPage.ticketTable.headerCell).toHaveCount(
      Object.keys(dashboardPage.ticketTable.tableHeaders).length,
    );
    await expect(dashboardPage.ticketTable.headerCell).toHaveText(
      Object.values(dashboardPage.ticketTable.tableHeaders),
    );

    await expect(dashboardPage.ticketTable.row).toHaveCount(1);
    const [newPage] = await Promise.all([
      context.waitForEvent('page'),
      dashboardPage.ticketTable.row.click(),
    ]);

    expect(newPage.url()).toEqual(tickets.tickets[0].url);
    await newPage.close();
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

    await expect(dashboardPage.ticketTable.headerCell).toHaveCount(
      Object.keys(dashboardPage.ticketTable.tableHeaders).length,
    );
    await expect(dashboardPage.ticketTable.headerCell).toHaveText(
      Object.values(dashboardPage.ticketTable.tableHeaders),
    );
    await expect(dashboardPage.ticketTable.row).toHaveCount(1);
    const [newPage] = await Promise.all([
      context.waitForEvent('page'),
      dashboardPage.ticketTable.row.click(),
    ]);

    expect(newPage.url()).toEqual(tickets.tickets[0].url);
  });
});
