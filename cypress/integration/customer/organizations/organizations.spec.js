import dashboardPage from 'pages/dashboard.page';
import { organizationPage } from 'pages/organization.page';
import { gettingStartedPage } from 'pages/gettingStarted.page';
import { timeouts } from '../../../fixtures/timeouts';
import {
  openViewOrganizationPage,
  prepareOrganizationWithAdminAndTechnical,
  verifyOrganizationName,
} from './helper';

context('Percona Customer', () => {
  let snAccount;

  context('Organization', () => {
    beforeEach(() => {
      cy.generateServiceNowAccount().then((account) => {
        snAccount = account;
      });
    });

    it('SAAS-T160 organization is created automatically for admin', () => {
      cy.oktaCreateUser(snAccount.admin1);

      // login as admin and verify organization is created automatically
      cy.loginByOktaApi(snAccount.admin1.email, snAccount.admin1.password);
      cy.findByTestId(dashboardPage.locators.ticketTable).isVisible();
      cy.checkPopUpMessage(organizationPage.constants.messages.customerOrgFound);
      openViewOrganizationPage();
      verifyOrganizationName(snAccount.name);
    });

    it('SAAS-T207 SAAS-T218 technical user is added to members if org exists', () => {
      prepareOrganizationWithAdminAndTechnical(snAccount);

      // login as technical and access View Organization
      cy.loginByOktaApi(snAccount.technical.email, snAccount.technical.password);
      cy.findByTestId(dashboardPage.locators.ticketTable).isVisible();
      cy.contains(gettingStartedPage.constants.labels.viewOrganization, { timeout: timeouts.HALF_MIN })
        .should('be.visible')
        .click();
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
        .click();
      verifyOrganizationName(snAccount.name);
    });
  });
});
