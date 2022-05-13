import { getUser } from 'pages/auth/getUser';
import dashboardPage from 'pages/dashboard.page';
import { organizationPage } from 'pages/organization.page';
import { timeouts } from '../../../fixtures/timeouts';
import { createOrgAndAddUsers } from './helper';

context('Dashboard Tests for customers', () => {
  let users = [];

  beforeEach(() => {
    cy.generateServiceNowAccount();
    cy.get('@snAccount').then((account) => {
      users.push(account.admin1, account.technical);
      users.forEach((user) => cy.oktaCreateUser(user));
    });
  });

  afterEach(() => {
    cy.cleanUpAfterTest(users, users[0]);
    users = [];
  });

  it('SAAS-T233 - Verify "open new ticket" link for Percona customer', () => {
    users.forEach((user) => {
      cy.log(`Running test for ${user.email} user`);
      cy.loginByOktaApi(user.email, user.password);
      cy.findByTestId(dashboardPage.locators.ticketTable, { timeout: timeouts.ONE_MIN }).isVisible();
      cy.findByTestId(dashboardPage.locators.ticketSection)
        .find('a')
        .hasAttr('target', '_blank')
        .hasAttr('href', dashboardPage.constants.links.serviceNowAddress);
      cy.removeCurrentUserAccessToken();
    });
  });

  it('SAAS-T193 SAAS-T196 Verify Percona Customer user is able to see tickets created for his org', () => {
    users.forEach((user) => {
      cy.log(`Running test for ${user.email} user`);
      cy.intercept('POST', '**/tickets:search').as('userTickets');
      cy.loginByOktaApi(user.email, user.password);
      // Table header exists with correct fields
      cy.findByTestId(dashboardPage.locators.tableHeader)
        .get('th')
        .should('have.length', dashboardPage.constants.labels.expectedTableHeaders.length)
        .each(([{ innerText }]) => {
          expect(dashboardPage.constants.labels.expectedTableHeaders).to.include(innerText);
        });
      // Table body exists, with one ticket
      cy.findByTestId(dashboardPage.locators.tableBody).then((tableBody) =>
        // eslint-disable-next-line no-magic-numbers
        expect(tableBody.length).to.be.equal(1),
      );
      cy.get('@userTickets')
        .its('response.body')
        .then((res) => {
          // Clicking on row opens new window with correct address.
          cy.window().then((win) => cy.stub(win, 'open').as('windowOpen'));
          cy.findByTestId(dashboardPage.locators.tableBody).click();
          cy.get('@windowOpen').should('be.calledWith', res.tickets[0].url);
        });
      cy.removeCurrentUserAccessToken();
    });
  });

  it('SAAS-T194 - Verify user is able to see empty list if there are no tickets on ServiceNow', () => {
    users.forEach((user) => {
      cy.log(`Running test for ${user.email} user`);
      cy.intercept('POST', '**/tickets:search', {
        statusCode: 200,
        body: { tickets: [] },
      });
      cy.loginByOktaApi(user.email, user.password);
      // Check if table is empty.
      cy.findByTestId(dashboardPage.locators.noDataTable, { timeout: timeouts.ONE_MIN }).should('exist');
      cy.removeCurrentUserAccessToken();
    });
  });

  it('SAAS-T234 - Verify free account user is not able to get organization tickets if he is a part of Org linked with SN', () => {
    const nonSnUser = getUser();

    cy.oktaCreateUser(nonSnUser);
    createOrgAndAddUsers(users[0], [{ email: nonSnUser.email, role: 'Admin' }]);
    cy.loginByOktaApi(nonSnUser.email, nonSnUser.password);
    // Wait for loading overlays to disappear only then table can become visible
    dashboardPage.methods.waitForDashboardToLoad();
    // Check if table is not present.
    cy.findByTestId(dashboardPage.locators.ticketSection).should('not.exist');
    cy.removeCurrentUserAccessToken();
  });

  it('SAAS-T224 - Verify Percona Customer user is able to view Contacts (dynamic)', () => {
    cy.intercept(
      'GET',
      /\/v1\/orgs\/([a-zA-Z0-9]+){8}-([a-zA-Z0-9]+){4}-([a-zA-Z0-9]+){4}-([a-zA-Z0-9]+){4}-([a-zA-Z0-9]+){8}$/g,
    ).as('organizationDetails');
    cy.loginByOktaApi(users[0].email, users[0].password);
    cy.checkPopUpMessage(organizationPage.constants.messages.customerOrgFound);
    dashboardPage.methods.waitForDashboardToLoad();
    cy.findByTestId(dashboardPage.locators.ticketTable, { timeout: timeouts.ONE_MIN }).isVisible();
    cy.window()
      .then((win) => cy.stub(win.navigator.clipboard, 'writeText'))
      .as('clipBoardContent');
    cy.findByTestId(dashboardPage.locators.emailContactLink)
      .contains(dashboardPage.constants.labels.contactsHelpEmail)
      .hasAttr('href', dashboardPage.constants.links.perconaHelpEmail);
    cy.findByTestId(dashboardPage.locators.customerContactIcon).click();
    cy.checkPopUpMessage(dashboardPage.constants.messages.emailCopiedClipboard);
    cy.get('@organizationDetails')
      .its('response.body.contacts')
      .then((res) => {
        cy.findByTestId(dashboardPage.locators.customerContactName).hasText(res.customer_success.name);
        cy.get('@clipBoardContent').should('be.calledWith', res.customer_success.email);
      });
  });
});
