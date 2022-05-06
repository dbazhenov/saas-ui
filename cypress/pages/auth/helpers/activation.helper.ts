import activationPage from '../activation.page';

export const activateUser = (password: string) => {
  cy.get(activationPage.locators.newPassword).type(password);
  cy.get(activationPage.locators.verifyPassword).type(password);
  cy.get(activationPage.locators.submitButton).click();
};
