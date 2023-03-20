import { test, expect } from '@playwright/test';
import { DashboardPage } from '@pages/dashboard.page';
import { UserRoles } from '@support/enums/userRoles';
import { oktaAPI, portalAPI, serviceNowAPI } from '@tests/api';
import User from '@support/types/user.interface';
import { routeHelper } from '@api/helpers';
import { getUser } from '@helpers/portalHelper';
import { endpoints } from '@tests/helpers/apiHelper';
import { SignInPage } from '@tests/pages/signIn.page';

test.describe('Spec file for dashboard tests for customers', async () => {
  let admin1User: User;
  let admin2User: User;
  let technicalUser: User;
  const users: User[] = [];
  let adminToken: string;

  test.beforeEach(async ({ page }) => {
    [admin1User, admin2User, technicalUser] = await serviceNowAPI.createServiceNowUsers();
    users.push(admin1User, admin2User, technicalUser);
    adminToken = await portalAPI.getUserAccessToken(admin1User.email, admin1User.password);
    await page.goto('/');
  });

  test.afterEach(async () => {
    await portalAPI.deleteUserOrgIfExists(admin1User);
    await oktaAPI.deleteUsers([admin1User, admin2User, technicalUser]);
  });

  test('SAAS-T194 - Verify user is able to see empty list if there are no tickets on ServiceNow @customers @dashboard', async ({
    page,
  }) => {
    test.slow();
    const signInPage = new SignInPage(page);
    const dashboardPage = new DashboardPage(page);

    await test.step('1. Mock BE response and login to the portal', async () => {
      await routeHelper.interceptBackEndCall(page, endpoints.listTickets, { tickets: [] });
      await signInPage.uiLogin(admin1User.email, admin1User.password);
      await dashboardPage.toast.checkToastMessage(dashboardPage.customerOrgCreated);
    });

    await test.step('2. Verify that empty table of tickets is displayed.', async () => {
      await dashboardPage.ticketTable.elements.emptyTable.waitFor({ state: 'visible', timeout: 60000 });
    });

    await test.step('3. Mock BE with tickets and reload page.', async () => {
      await routeHelper.interceptBackEndCall(page, endpoints.listTickets, {
        tickets: dashboardPage.ticketOverview.tickets,
      });
      await page.reload();
      await dashboardPage.ticketOverview.ticketOverviewContainer.waitFor({
        state: 'visible',
        timeout: 60000,
      });
    });

    await test.step('4. Verify that displayed ticker equal mocked BE data.', async () => {
      const displayedDepartments = await dashboardPage.ticketOverview.departmentName.allTextContents();
      const ticketData = dashboardPage.ticketOverview.tickets.map((ticket) => ticket.department);

      expect(displayedDepartments.sort()).toEqual(ticketData.sort());

      await expect(dashboardPage.ticketOverview.totalTicketNumber).toHaveText(
        dashboardPage.ticketOverview.tickets.length.toString(),
      );

      await dashboardPage.ticketOverview.verifyTicketNumberDepartment('1');
      await dashboardPage.ticketTable.elements.table.waitFor({ state: 'visible' });
    });

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
    test.info().annotations.push({
      type: 'Also Covers',
      description: 'SAAS-T265 - Verify rows per page element for Tickets Overview',
    });
    const signInPage = new SignInPage(page);
    const dashboardPage = new DashboardPage(page);
    let tickets;

    await test.step('Login to the Portal', async () => {
      await signInPage.uiLogin(admin1User.email, admin1User.password);
    });

    await test.step('Verify that default value for Rows per page is 10', async () => {
      tickets = dashboardPage.ticketOverview.generateNumberOfTickets(101);

      await routeHelper.interceptBackEndCall(page, endpoints.listTickets, {
        tickets,
      });
      await page.reload();
      await page.waitForTimeout(5000);
      await page.mouse.wheel(0, 1000);
      await dashboardPage.ticketTable.elements.table.waitFor({ state: 'visible' });
      await expect(dashboardPage.ticketTable.elements.row).toHaveCount(10);
    });

    await test.step(
      'Verify that there is possibility to select rows per page from the next list of values: 10, 25, 50, 100',
      async () => {
        await dashboardPage.ticketTable.pagination.fields.select.click();
        await expect(dashboardPage.ticketTable.pagination.fields.sizeSelect).toHaveCount(
          dashboardPage.ticketTable.pagination.labels.texts.length,
        );
        await expect(dashboardPage.ticketTable.pagination.fields.sizeSelect).toHaveText(
          dashboardPage.ticketTable.pagination.labels.texts.map(String),
        );
      },
    );

    await test.step(
      'Select 25 and verify that the only 25 tickets is displayed on the first page',
      async () => {
        await dashboardPage.ticketTable.pagination.verifyPagination(25);
      },
    );

    await test.step(
      'Select 50 and verify that the only 50 tickets is displayed on the first page',
      async () => {
        await dashboardPage.ticketTable.pagination.fields.select.click();
        await dashboardPage.ticketTable.pagination.verifyPagination(50);
      },
    );

    await test.step(
      'Select 100 and verify that the only 100 tickets is displayed on the first page',
      async () => {
        await dashboardPage.ticketTable.pagination.fields.select.click();
        await dashboardPage.ticketTable.pagination.verifyPagination(100);
      },
    );

    await test.step('Verify there is pagination button under the list of tickets', async () => {
      await dashboardPage.ticketTable.pagination.fields.select.click();
      await dashboardPage.ticketTable.pagination.verifyPagination(10);
      await dashboardPage.ticketTable.pagination.buttons.previousPage.waitFor({ state: 'visible' });
      await dashboardPage.ticketTable.pagination.buttons.nextPage.waitFor({ state: 'visible' });
    });

    await test.step('Click on "Next" button and Verify that the next page of tickets is opened', async () => {
      await dashboardPage.ticketTable.pagination.buttons.nextPage.click();
      await expect(dashboardPage.ticketTable.pagination.elements.intervalLocator).toHaveText(
        dashboardPage.ticketTable.pagination.labels.interval('11', '20', '101'),
      );
      await dashboardPage.ticketTable.verifyRowData(tickets[10], 0);
    });

    await test.step('Click on "Back" button and Verify the first page of tickets is opened', async () => {
      await dashboardPage.ticketTable.pagination.buttons.previousPage.click();
      await expect(dashboardPage.ticketTable.pagination.elements.intervalLocator).toHaveText(
        dashboardPage.ticketTable.pagination.labels.interval('1', '10', '101'),
      );
      await dashboardPage.ticketTable.verifyRowData(tickets[0], 0);
    });
  });

  test('SAAS-T247 - Verify user with Percona customer organization can see the tickets overview on Portal @customers @dashboard', async ({
    page,
  }) => {
    const signInPage = new SignInPage(page);
    const dashboardPage = new DashboardPage(page);

    await test.step('Navigate to Portal and wait for ticket overview to display.', async () => {
      await routeHelper.interceptBackEndCall(page, endpoints.listTickets, {
        tickets: dashboardPage.ticketOverview.tickets,
      });
      await signInPage.uiLogin(admin1User.email, admin1User.password);
      await dashboardPage.toast.checkToastMessage(dashboardPage.customerOrgCreated);
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
    context,
  }) => {
    test.info().annotations.push(
      {
        type: 'Also Covers',
        description:
          'SAAS-T193 -Verify Percona customer Admin user is able to see tickets created for his org',
      },
      {
        type: 'Also Covers',
        description: 'SAAS-T224 - Verify Percona Customer user is able to view Contacts (dynamic)',
      },
    );
    const signInPage = new SignInPage(page);
    const dashboardPage = new DashboardPage(page);

    await context.grantPermissions(['clipboard-write', 'clipboard-read']);

    await test.step('1. Login to the portal', async () => {
      await signInPage.uiLogin(admin1User.email, admin1User.password);
      await dashboardPage.toast.checkToastMessage(dashboardPage.customerOrgCreated);
    });

    await test.step('2. Verify Open New Ticket Button', async () => {
      await dashboardPage.verifyOpenNewTicketButton();
    });

    await test.step('3. Verify tickets for the organization.', async () => {
      const org = await portalAPI.getOrg(adminToken);
      const tickets = await portalAPI.getOrgTickets(adminToken, org.orgs[0].id);

      await expect(dashboardPage.ticketTable.elements.headerCell).toHaveCount(
        Object.keys(dashboardPage.ticketTable.tableHeaders).length,
      );
      await expect(dashboardPage.ticketTable.elements.headerCell).toHaveText(
        Object.values(dashboardPage.ticketTable.tableHeaders),
      );

      await expect(dashboardPage.ticketTable.elements.row).toHaveCount(1);
      const [newPage] = await Promise.all([
        context.waitForEvent('page'),
        dashboardPage.ticketTable.elements.row.click(),
      ]);

      expect(newPage.url()).toEqual(tickets.tickets[0].url);
      await newPage.close();
    });

    await test.step('4. Verify Percona Customer user is able to view Contacts (dynamic)', async () => {
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
      await dashboardPage.toast.checkToastMessage(dashboardPage.messages.emailCopiedClipboard);
      const clipboardContent = await page.evaluate(() => navigator.clipboard.readText());

      expect(clipboardContent).toEqual(orgDetails.contacts.customer_success.email);
      await expect(dashboardPage.contacts.customerContactName).toHaveText(
        orgDetails.contacts.customer_success.name,
      );
    });
  });

  test('SAAS-T233 - Verify "open new ticket" link for Percona customer Technical User @customers @dashboard', async ({
    page,
    context,
  }) => {
    test.info().annotations.push({
      type: 'Also Covers',
      description:
        'SAAS-T196 - Verify Percona Customer Technical user is able to see tickets created for his org',
    });
    const signInPage = new SignInPage(page);
    const dashboardPage = new DashboardPage(page);

    await test.step('1. Login to the portal', async () => {
      await signInPage.uiLogin(technicalUser.email, technicalUser.password);
      await dashboardPage.toast.checkToastMessage(dashboardPage.customerOrgCreated);
    });

    await test.step('2. Verify Open New Ticket Button', async () => {
      await dashboardPage.verifyOpenNewTicketButton();
    });

    await test.step('3. Verify tickets for the organization.', async () => {
      const technicalToken = await portalAPI.getUserAccessToken(technicalUser.email, technicalUser.password);
      const org = await portalAPI.getOrg(technicalToken);
      const tickets = await portalAPI.getOrgTickets(technicalToken, org.orgs[0].id);

      await expect(dashboardPage.ticketTable.elements.headerCell).toHaveCount(
        Object.keys(dashboardPage.ticketTable.tableHeaders).length,
      );
      await expect(dashboardPage.ticketTable.elements.headerCell).toHaveText(
        Object.values(dashboardPage.ticketTable.tableHeaders),
      );
      await expect(dashboardPage.ticketTable.elements.row).toHaveCount(1);
      const [newPage] = await Promise.all([
        context.waitForEvent('page'),
        dashboardPage.ticketTable.elements.row.click(),
      ]);

      expect(newPage.url()).toEqual(tickets.tickets[0].url);
      await newPage.close();
    });
  });

  test('SAAS-T234 - Verify free account user is not able to get organization tickets if he is a part of Org linked with SN @customers @dashboard', async ({
    page,
  }) => {
    const signInPage = new SignInPage(page);
    const dashboardPage = new DashboardPage(page);
    const nonSnUser = getUser();
    const snOrg = await portalAPI.createOrg(adminToken, 'SAAS-T234 Org');

    await oktaAPI.createUser(nonSnUser);
    await portalAPI.inviteOrgMember(adminToken, snOrg.org.id, {
      username: nonSnUser.email,
      role: UserRoles.admin,
    });

    await test.step('1. Login to the portal', async () => {
      await signInPage.uiLogin(nonSnUser.email, nonSnUser.password);
    });

    await test.step('2. Verify that ticket table is not displayed.', async () => {
      await dashboardPage.contacts.contactsLoadingSpinner.waitFor({ state: 'detached' });
      await dashboardPage.contacts.accountLoadingSpinner.waitFor({ state: 'detached' });
      await dashboardPage.elements.ticketSection.waitFor({ state: 'detached', timeout: 10000 });
    });
  });
});
