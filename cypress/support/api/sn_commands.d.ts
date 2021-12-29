declare namespace Cypress {
  interface Chainable {
    /**
     * Generate Service Now Account and create cypress alias ('snAccount') for this account.
     *
     * @example
     *   cy.generateServiceNowAccount();
     *   cy.get('@snAccount').then((account) => {
     *   cy.log(account.name);
     *   });
     */
    generateServiceNowAccount(): Chainable;
  }
}
