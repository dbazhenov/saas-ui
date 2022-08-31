import dashboardPage from 'pages/dashboard.page';
import { organizationPage } from 'pages/organization.page';
import { gettingStartedPage } from 'pages/gettingStarted.page';
import { timeouts } from '../../../fixtures/timeouts';
import { openViewOrganizationPage, verifyOrganizationName } from './helper';

context('Percona Customer', () => {
  let snAccount;
  let users = [];

  beforeEach(() => {
    cy.generateServiceNowAccount().then((account) => {
      snAccount = account;
      users.push(account.admin1, account.technical);
      users.forEach((user) => cy.oktaCreateUser(user));
    });
  });

  afterEach(() => {
    cy.cleanUpAfterTest(users, users[0]);
    users = [];
  });

  it.skip('SAAS-T160 organization is created automatically for admin', () => {
    // login as admin and verify organization is created automatically
    cy.loginByOktaApi(snAccount.admin1.email, snAccount.admin1.password);
    cy.findByTestId(dashboardPage.locators.ticketTable, { timeout: timeouts.ONE_MIN }).isVisible();
    cy.checkPopUpMessage(organizationPage.constants.messages.customerOrgFound);
    openViewOrganizationPage();
    verifyOrganizationName(snAccount.name);
  });

  it('SAAS-T207 SAAS-T218 technical user is added to members if org exists', () => {
    // Temporary workaround until SAAS-917 is fixed
    cy.getUserAccessToken(snAccount.admin1.email, snAccount.admin1.password).then((token) =>
      cy.apiCreateOrg(token),
    );
    cy.loginByOktaApi(snAccount.technical.email, snAccount.technical.password);
    cy.findByTestId(dashboardPage.locators.ticketTable, { timeout: timeouts.ONE_MIN }).isVisible();
    cy.contains(gettingStartedPage.constants.labels.viewOrganization, { timeout: timeouts.HALF_MIN })
      .should('be.visible')
      .click({ force: true });
    // open Members tab
    organizationPage.methods.openMembersTab();

    // verify there are 2 org members
    cy.findAllByTestId('table-tbody-tr')
      // eslint-disable-next-line no-magic-numbers
      .should('have.length', 2)
      .find('td')
      .contains(snAccount.technical.email);

    // open Members tab
    cy.findAllByTestId('manage-organization-tab')
      .contains(organizationPage.constants.labels.organizationTabLabel)
      .click({ force: true });
    verifyOrganizationName(snAccount.name);
  });

  it.skip('SAAS-T222 Verify Percona Customer account user is not able to update organization name  ', () => {
    users.forEach((user) => {
      cy.loginByOktaApi(user.email, user.password);
      cy.findByTestId(dashboardPage.locators.ticketTable, { timeout: timeouts.ONE_MIN }).isVisible();
      cy.contains(gettingStartedPage.constants.labels.viewOrganization, { timeout: timeouts.HALF_MIN })
        .should('be.visible')
        .click({ force: true });
      cy.findAllByTestId(organizationPage.locators.organizationContainer).then(() => {
        cy.findAllByTestId(organizationPage.locators.editOrgButton).should('not.exist');
      });
      cy.removeCurrentUserAccessToken();
    });
  });
});
