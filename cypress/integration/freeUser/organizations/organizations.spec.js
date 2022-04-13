import { getUser } from 'pages/auth/getUser';
import dashboardPage from 'pages/dashboard.page';
import { MESSAGES } from 'pages/common/constants';
import { organizationPage } from 'pages/organization.page';
import { gettingStartedPage } from 'pages/gettingStarted.page';
import { timeouts } from '../../../fixtures/timeouts';

context('Free user', () => {
  const orgName = '&e2e org?';

  beforeEach(() => {
    cy.wrap(getUser()).then((userWithOrg) => {
      cy.oktaCreateUser(userWithOrg);
      // create org by admin
      cy.getUserAccessToken(userWithOrg.email, userWithOrg.password).then((adminAccessToken) => {
        cy.apiCreateOrg(adminAccessToken, orgName);
      });
    });

    // create fresh user and login
    cy.wrap(getUser()).then((adminUser) => {
      cy.oktaCreateUser(adminUser);
      cy.loginByOktaApi(adminUser.email, adminUser.password);
    });
  });

  it('SAAS-T136 SAAS-T139 SAAS-T159 create organization', () => {
    const date = new Date().toLocaleDateString();

    dashboardPage.methods.waitForDashboardToLoad();
    cy.contains(gettingStartedPage.constants.labels.addOrganization).isVisible().click();
    cy.findByTestId(organizationPage.locators.createOrgNameInput)
      .as('orgNameField')
      .hasAttr('placeholder', organizationPage.constants.labels.orgNamePlaceholder)
      .type('test')
      .clear();
    cy.findByTestId(organizationPage.locators.createOrgSubmitButton).as('createButton').isDisabled();
    cy.findByTestId(organizationPage.locators.createOrgNameInputError).hasText(MESSAGES.REQUIRED_FIELD);

    cy.get('@orgNameField').type(orgName);
    cy.get('@createButton').click();
    cy.checkPopUpMessage(organizationPage.constants.messages.orgCreatedSuccessfully);

    cy.contains(organizationPage.constants.labels.orgNameLabel, { timeout: timeouts.TWENTY_SEC })
      .find('strong')
      .should('have.text', orgName);
    cy.contains(organizationPage.constants.labels.creationDateLabel).find('strong').should('have.text', date);
  });
});
