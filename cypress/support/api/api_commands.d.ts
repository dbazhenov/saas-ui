declare namespace Cypress {
  interface Chainable {
    /**
     * Get User object by email.
     *
     * @example
     *   afterEach(() => {
     * cy.cleanUpAfterTest([adminUser, technicalUser], orgAdminUser)
     *   }
     * @param userEmail
     */
    cleanUpAfterTest(users, orgAdminUser): Chainable;
  }
}
