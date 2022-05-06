import { gettingStartedPage } from 'pages/gettingStarted.page';
import { organizationPage } from 'pages/organization.page';
import { timeouts } from '../../../fixtures/timeouts';

export const openViewOrganizationPage = () => {
  cy.contains(gettingStartedPage.constants.labels.viewOrganization, { timeout: timeouts.HALF_MIN })
    .should('be.visible')
    .click();
  cy.contains(organizationPage.constants.labels.orgNameLabel, { timeout: timeouts.HALF_MIN }).should(
    'be.visible',
  );
};

export const verifyOrganizationName = (name) => {
  cy.contains(organizationPage.constants.labels.orgNameLabel, { timeout: timeouts.HALF_MIN })
    .find('strong')
    .should('have.text', name);
};

export const prepareOrganizationWithAdminAndTechnical = (snAccount) => {
  // create org by admin
  cy.getUserAccessToken(snAccount.admin1.email, snAccount.admin1.password).then((adminAccessToken) => {
    cy.apiCreateOrg(adminAccessToken);
  });

  // create org by technical
  cy.getUserAccessToken(snAccount.technical.email, snAccount.technical.password).then((adminAccessToken) => {
    cy.apiCreateOrg(adminAccessToken);
  });
};
