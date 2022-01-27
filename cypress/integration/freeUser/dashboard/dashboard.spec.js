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
    cy.findByTestId(dashboardPage.locators.ticketSection).should('not.exist');
  });
});
