import { getUser } from 'pages/auth/getUser';
import { commonPage } from 'pages/common.page';
import dashboardPage from 'pages/dashboard.page';
import { timeouts } from '../../../fixtures/timeouts';
import { createOrgAndAddUsers, getOrgAndAddUsers } from './helper';

context('Dashboard Tests for customers', () => {
  let users = [];

  beforeEach(() => {
    users = [];
    cy.generateServiceNowAccount();
    cy.get('@snAccount').then((account) => {
      users.push(account.admin1, account.technical);
      users.forEach((user) => cy.oktaCreateUser(user));
      createOrgAndAddUsers(users[0], [{ email: users[1].email, role: 'Technical' }]);
    });
  });

  it('SAAS-T233 - Verify "open new ticket" link for Percona customer', () => {
    users.forEach((user) => {
      cy.log(`Running test for ${user.email} user`);
      cy.loginByOktaApi(user.email, user.password);
      cy.findAllByTestId(commonPage.locators.sideMenuLink).get('a[href*="/dashboard"]').click();
      cy.findByTestId(dashboardPage.locators.ticketSection)
        .find('a')
        .hasAttr('target', '_blank')
        .hasAttr('href', dashboardPage.links.serviceNowAddress);
      cy.removeCurrentUserAccessToken();
    });
  });

  it('SAAS-T193 SAAS-T196 Verify Percona Customer user is able to see tickets created for his org', () => {
    users.forEach((user) => {
      cy.log(`Running test for ${user.email} user`);
      cy.intercept('POST', '**/tickets:search').as('userTickets');
      cy.loginByOktaApi(user.email, user.password);
      cy.findAllByTestId(commonPage.locators.sideMenuLink).get('a[href*="/dashboard"]').click();
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
      cy.findAllByTestId(commonPage.locators.sideMenuLink).get('a[href*="/dashboard"]').click();
      // Check if table is empty.
      cy.findByTestId(dashboardPage.locators.noDataTable).should('exist');
      cy.removeCurrentUserAccessToken();
    });
  });

  it('SAAS-T234 - Verify free account user is not able to get organization tickets if he is a part of Org linked with SN', () => {
    const nonSnUser = getUser();

    cy.oktaCreateUser(nonSnUser);
    getOrgAndAddUsers(users[0], [{ email: nonSnUser.email, role: 'Admin' }]);
    cy.loginByOktaApi(nonSnUser.email, nonSnUser.password);
    cy.findAllByTestId(commonPage.locators.sideMenuLink).get('a[href*="/dashboard"]').click();
    // Wait for loading overlays to disappear only then table can become visible
    cy.findAllByTestId(dashboardPage.locators.loadingOverlaySpinners, { timeout: timeouts.HALF_MIN }).should(
      'not.exist',
    );
    // Check if table is not present.
    cy.findByTestId(dashboardPage.locators.ticketSection).should('not.exist');
    cy.removeCurrentUserAccessToken();
  });
});
