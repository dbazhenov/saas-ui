import { commonPage } from 'pages/common.page';
import dashboardPage from 'pages/dashboard.page';
import { createOrgAndAddUsers } from './helper';

context('Dashboard Tests for customers', () => {
  let users = [];

  beforeEach(() => {
    cy.generateServiceNowAccount();
    cy.get('@snAccount').then((account) => {
      users.push(account.admin1, account.technical);
      users.forEach((user) => cy.oktaCreateUser(user));
      createOrgAndAddUsers(users);
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
});
