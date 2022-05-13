import { getUser } from 'pages/auth/getUser';
import commonPage from 'pages/common.page';
import signInPage from 'pages/auth/signIn.page';

const newUser = getUser();

context('Logout', () => {
  beforeEach(() => {
    cy.oktaCreateUser(newUser);
    cy.loginByOktaApi(newUser.email, newUser.password);
  });

  afterEach(() => {
    cy.cleanUpAfterTest([newUser]);
  });

  it('SAAS-T80 - should be able to logout', () => {
    commonPage.methods.uiLogoutUser();
    cy.visit('');
    signInPage.methods.isSignInPageDisplayed();
  });
});
