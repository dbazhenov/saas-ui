import dashboardPage from 'pages/dashboard.page';
import { organizationPage } from 'pages/organization.page';
import { timeouts } from '../../../fixtures/timeouts';
import { openViewOrganizationPage, prepareOrganizationWithAdminAndTechnical } from './helper';

context('Percona Customer', () => {
  let snAccount;

  context('Members', () => {
    before(() => {
      cy.generateServiceNowAccount().then((account) => {
        snAccount = account;
        // create users
        cy.oktaCreateUser(snAccount.admin1);
        cy.oktaCreateUser(snAccount.admin2);
        cy.oktaCreateUser(snAccount.technical);
        prepareOrganizationWithAdminAndTechnical(snAccount);
      });
    });

    afterEach(() => {
      cy.cleanUpAfterTest([snAccount.admin1, snAccount.admin2, snAccount.technical], snAccount.admin1);
    });

    it('SAAS-T223 SAAS-T174 members list', () => {
      cy.loginByOktaApi(snAccount.admin2.email, snAccount.admin2.password);
      cy.findByTestId(dashboardPage.locators.ticketTable, { timeout: timeouts.ONE_MIN }).isVisible();
      openViewOrganizationPage();
      organizationPage.methods.openMembersTab();

      const users = [
        {
          Name: `${snAccount.admin1.firstName} ${snAccount.admin1.lastName}`,
          Email: snAccount.admin1.email,
          Role: 'Admin',
        },
        {
          Name: `${snAccount.admin2.firstName} ${snAccount.admin2.lastName}`,
          Email: snAccount.admin2.email,
          Role: 'Admin',
        },
        {
          Name: `${snAccount.technical.firstName} ${snAccount.technical.lastName}`,
          Email: snAccount.technical.email,
          Role: 'Technical',
        },
      ];

      // verify users info in members table
      cy.findByTestId('table')
        .getTable({ onlyColumns: ['Name', 'Email', 'Role'] })
        .then((table) => {
          expect(table.length).to.be.equal(users.length);
          users.forEach((user) => expect(table).to.deep.include(user));
        });
    });
  });
});
