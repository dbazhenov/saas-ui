import { timeouts } from '../../../fixtures/timeouts';
import signInPage from '../signIn.page';

export const fillOutSignInUserDetails = (email?: string, password?: string) => {
  if (email) {
    cy.get(signInPage.locators.emailInput).focus().click().type(email);
  }

  cy.get(signInPage.locators.nextButton).click();
  if (password) {
    cy.get(signInPage.locators.passwordInput, { timeout: timeouts.HALF_MIN }).focus().click().type(password);
  }
};

export const isSignInPageDisplayed = () => {
  cy.get(signInPage.locators.emailInput).isVisible().isEnabled();
  cy.get(signInPage.locators.nextButton).isVisible().isEnabled();
};
