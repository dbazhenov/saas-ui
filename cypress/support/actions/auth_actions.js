// Temp skip because of webpack compilation error
Cypress.Commands.add('runLoginAction', (user, shouldFail) => {
  cy.window().its('store').invoke('dispatch', '');
  if (shouldFail) return;

  cy.wait('@signin').then(() => {
    cy.visit('/');
    cy.wait('@refresh');
  });
});

// Temp skip because of webpack compilation error
Cypress.Commands.add('runLogoutAction', () => {
  cy.window().its('store').invoke('dispatch', '');
  cy.wait('@signout');
});
