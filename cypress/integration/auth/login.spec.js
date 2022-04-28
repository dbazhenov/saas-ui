import { pageDetailsMap, Pages } from 'pages/common/constants';
import { getUser } from 'pages/auth/getUser';
import signInPage from 'pages/auth/signIn.page';
import commonPage from 'pages/common.page';
import dashboardPage from 'pages/dashboard.page';

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
    cy.get(signInPage.locators.emailInput).isVisible();
    cy.get(signInPage.locators.nextButton)
      .isEnabled()
      .should('have.value', signInPage.constants.messages.nextButtonText);
    cy.get(signInPage.locators.formHeader).hasText(signInPage.constants.messages.formHeaderText);
    cy.get(signInPage.locators.needHelp).hasText(signInPage.constants.messages.needHelp).click();
    cy.get(signInPage.locators.forgotPassword).hasText(signInPage.constants.messages.forgotPassword);
    cy.get(signInPage.locators.helpLink).hasText(signInPage.constants.messages.helpLink);
    cy.get(signInPage.locators.signUpLink).hasText(signInPage.constants.messages.signUpLink);
  });

  it('SAAS-T82 Verify successful login on Percona Portal', () => {
    signInPage.methods.fillOutSignInUserDetails(newUser.email, newUser.password);
    cy.get(signInPage.locators.signInButton).click();
    commonPage.methods.commonPageLoaded();
    cy.url().should('include', Cypress.config('baseUrl'));
    cy.findByTestId(dashboardPage.locators.gettingStartedContainer).isVisible();
  });

  it('SAAS-T86 Verify unsuccessful login on Percona Portal', () => {
    signInPage.methods.fillOutSignInUserDetails('Wrong Username', 'WrongPassword');
    cy.get(signInPage.locators.signInButton).click();
    cy.get(signInPage.locators.unableToSignIn).hasText(signInPage.constants.messages.unableToSignIn);
    cy.findByTestId(dashboardPage.locators.gettingStartedContainer).should('not.exist');
    cy.url().should('include', '/login');
  });
});
