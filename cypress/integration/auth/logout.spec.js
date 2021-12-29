import { loginButton } from 'pages/auth/selectors';
import { dropdownMenu, logoutButton, profileIcon } from 'pages/main/selectors';
import { getUser } from 'pages/auth/getUser';

const newUser = getUser();

context('Logout', () => {
  beforeEach(() => {
    cy.oktaCreateUser(newUser);
    cy.loginByOktaApi(newUser.email, newUser.password);
  });

  it('SAAS-T80 - should be able to logout', () => {
    profileIcon().click();
    dropdownMenu().isVisible();
    logoutButton().click();
    loginButton().isVisible();
  });
});
