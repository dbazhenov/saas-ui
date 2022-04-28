import { getUser } from 'pages/auth/getUser';
import commonPage from 'pages/common.page';
import dashboardPage from 'pages/dashboard.page';
import errorPage from 'pages/error.page';
import { LeftMainMenuLinks } from 'pages/helpers/commonPage.helper';
import { createOrgAndAddUsers } from '../../integration/customer/dashboard/helper';

context('Pages Tests', () => {
  let adminUser;
  let technicalUser;
  let users = [];

  beforeEach(() => {
    users = [];
    adminUser = getUser();
    technicalUser = getUser();
    cy.oktaCreateUser(adminUser);
    cy.oktaCreateUser(technicalUser);
    users.push(adminUser, technicalUser);
    createOrgAndAddUsers(adminUser, [{ email: technicalUser.email, role: 'Technical' }]);
  });

  it('SAAS-T118 - Verify access to a non-existent private route returns 404 page', () => {
    cy.loginByOktaApi(adminUser.email, adminUser.password);
    cy.log('Also Covers: SAAS-T119 Verify user can navigate back to Homepage from 404 for private route');
    cy.visit('/page1');
    cy.get(errorPage.locators.errorPageLightBackground).should(
      'have.css',
      'background-color',
      'rgb(247, 248, 250)',
    );
    cy.findByTestId(errorPage.locators.Image404);
    cy.findByTestId(errorPage.locators.homeButton404).click();
    dashboardPage.methods.waitForDashboardToLoad();
    cy.findByTestId(commonPage.locators.themeSwitch).click({ force: true });
    cy.visit('/page1');
    cy.get(errorPage.locators.errorPageDarkBackground).should(
      'have.css',
      'background-color',
      'rgb(11, 12, 14)',
    );
    cy.findByTestId(errorPage.locators.Image404);
    cy.findByTestId(errorPage.locators.homeButton404).click();
    dashboardPage.methods.waitForDashboardToLoad();
  });

  it('SAAS-T203 - Verify Percona Portal Resources menu tab content and links', () => {
    cy.log('Also covers: SAAS-T204 Verify user can see Percona Portal Resources regardless of the role');
    users.forEach((user) => {
      cy.loginByOktaApi(user.email, user.password);
      cy.findByTestId(commonPage.locators.resourcesHeader).hasText(
        commonPage.constants.labels.resourcesHeader,
      );
      cy.get(commonPage.locators.documentationLink)
        .hasAttr('target', '_blank')
        .hasText(commonPage.constants.labels.documentationLink);
      cy.get(commonPage.locators.blogLink)
        .hasAttr('target', '_blank')
        .hasText(commonPage.constants.labels.blogLink);
      cy.get(commonPage.locators.forumsLink)
        .hasAttr('target', '_blank')
        .hasText(commonPage.constants.labels.forumsLink);
      cy.get(commonPage.locators.portalHelpLink)
        .hasAttr('target', '_blank')
        .hasText(commonPage.constants.labels.portalHelpLink);
      cy.findByTestId(commonPage.locators.mainHeader).hasText(commonPage.constants.labels.mainHeader);
      cy.get(LeftMainMenuLinks.dashboard).hasText(commonPage.constants.labels.dashboardLink);
      cy.get(LeftMainMenuLinks.organization).hasText(commonPage.constants.labels.organizationLink);
      cy.get(LeftMainMenuLinks.pmmInstances).hasText(commonPage.constants.labels.pmmInstancesLink);
      cy.logoutUser();
    });
  });
});
