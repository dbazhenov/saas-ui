import { timeouts } from '../../../fixtures/timeouts';
import { getUser } from 'pages/auth/getUser';
import { commonPage } from 'pages/common.page';
import dashboardPage from 'pages/dashboard.page';

const newUser = getUser();

context('Dashboard Tests for Free user', () => {
  beforeEach(() => {
    cy.oktaCreateUser(newUser);
    cy.loginByOktaApi(newUser.email, newUser.password).then(() => {
      cy.retrieveCurrentUserAccessToken().then((token) => cy.apiCreateOrg(token));
    });
  });

  it('SAAS-T198 - Verify free account user is not able to get organization tickets', () => {
    cy.findAllByTestId(commonPage.locators.sideMenuLink).get('a[href*="/dashboard"]').click();
    //Wait for loading overlays to dissapear only then table can become visible
    cy.findAllByTestId(dashboardPage.locators.loadingOverlaySpinners, { timeout: timeouts.HALF_MIN }).should(
      'not.exist',
    );
    // Check if table is not present.
    cy.findByTestId(dashboardPage.locators.ticketSection).should('not.exist');
  });
});
