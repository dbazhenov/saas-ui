import signInPage from '../signIn.page';

export const fillOutSignInUserDetails = (email?: string, password?: string) => {
  if(email) cy.get(signInPage.locators.emailInput).focus().click().type(email);

  cy.get('#idp-discovery-submit').click();
  if(password) cy.get(signInPage.locators.passwordInput).focus().click().type(password);
};
