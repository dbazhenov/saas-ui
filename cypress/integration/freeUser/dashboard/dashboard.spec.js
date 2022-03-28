import { getUser } from 'pages/auth/getUser';
import { commonPage } from 'pages/common.page';
import dashboardPage from 'pages/dashboard.page';
import {LeftMainMenuLinks} from 'pages/helpers/commonPage.helper';

context('Dashboard Tests for Free user', () => {
  let newUser;

  beforeEach(() => {
    newUser = getUser();
    cy.oktaCreateUser(newUser);
    cy.loginByOktaApi(newUser.email, newUser.password).then(() => {
      cy.retrieveCurrentUserAccessToken().then((token) => cy.apiCreateOrg(token));
    });
  });

  it('SAAS-T198 - Verify free account user is not able to get organization tickets', () => {
    commonPage.methods.leftMainMenuClick(LeftMainMenuLinks.dashboard);
    // Wait for loading overlays to disappear only then table can become visible
    dashboardPage.methods.waitForDashboardToLoad();
    // Check if table is not present.
    cy.findByTestId(dashboardPage.locators.ticketSection).should('not.exist');
  });

  it('SAAS-T225 Verify Free account user is able to view Contacts (static)', () => {
    commonPage.methods.leftMainMenuClick(LeftMainMenuLinks.dashboard);
    dashboardPage.methods.waitForDashboardToLoad();
    cy.contains(dashboardPage.constants.labels.perconaContacts).should('be.visible');
    cy.findByTestId(dashboardPage.locators.emailContactLink)
        .contains(dashboardPage.constants.labels.contactsHelpEmail)
        .hasAttr('href', dashboardPage.constants.links.perconaHelpEmail);
    cy.findByTestId(dashboardPage.locators.forumContactLink)
        .contains(dashboardPage.constants.labels.contactsForums)
        .hasAttr('target', '_blank')
        .hasAttr('href', dashboardPage.constants.links.perconaForum);
    cy.findByTestId(dashboardPage.locators.discordContactLink)
        .contains(dashboardPage.constants.labels.contactsDiscord)
        .hasAttr('target', '_blank')
        .hasAttr('href', dashboardPage.constants.links.perconaDiscord);
    cy.findByTestId(dashboardPage.locators.contactPageLink)
        .contains(dashboardPage.constants.labels.contactsContactPage)
        .hasAttr('target', '_blank')
        .hasAttr('href', dashboardPage.constants.links.perconaContactPage);
  });
});
