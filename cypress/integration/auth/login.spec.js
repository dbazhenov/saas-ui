import { loginButton, loginHelpLink, resetPasswordLink, signUpLink } from 'pages/auth/selectors';
import { pageDetailsMap, Pages } from 'pages/common/constants';
import { getUser } from 'pages/auth/getUser';
import { profileIcon } from 'pages/main/selectors';
import { FORGOT_PASSWORD_LINK, HELP_LINK, SIGNUP_LINK } from 'pages/auth/constants';
import { timeouts as TIMEOUTS } from '../../fixtures/timeouts';

const newUser = getUser();

context('Login', () => {
  before(() => {
    cy.oktaCreateUser(newUser);
  });

  after(() => {
    // Delete user after tests
    cy.oktaDeleteUserByEmail(newUser.email);
  });

  beforeEach(() => {
    cy.visit(pageDetailsMap[Pages.Login].url);
  });

  it('SAAS-T200 - should be able to see landing page form', () => {
    loginButton().isVisible().hasText('Login with Percona Account');
    signUpLink().isVisible().hasAttr('href', SIGNUP_LINK).hasAttr('target', '_blank').hasText('Sign up');
    resetPasswordLink()
      .isVisible()
      .hasAttr('href', FORGOT_PASSWORD_LINK)
      .hasAttr('target', '_blank')
      .hasText('Reset password');
    loginHelpLink().isVisible().hasAttr('href', HELP_LINK).hasAttr('target', '_blank').hasText('Help');
  });

  it('SAAS-T111 SAAS-T81 - should be able to login', () => {
    loginButton().click();
    cy.get('#okta-signin-submit').should('be.visible');
    cy.get('#okta-signin-username').type(newUser.email);
    cy.get('#okta-signin-password').type(newUser.password);
    cy.get('#okta-signin-submit').hasAttr('value', 'Sign In').click().wait(TIMEOUTS.FIVE_SEC);

    cy.findByTestId('getting-started-container', { timeout: TIMEOUTS.TEN_SEC }).should('be.visible');
    cy.url().should('be.equal', `${Cypress.config('baseUrl')}/`);
    profileIcon().isVisible();
  });
});
