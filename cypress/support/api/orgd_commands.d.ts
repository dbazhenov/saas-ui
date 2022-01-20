declare namespace Cypress {
  interface Chainable {
    /**
     * Create organization API call.
     *
     * @example
     *   cy.apiCreateOrg(userAccessToken, 'some org name');
     * @param accessToken
     * @param orgName
     */
    apiCreateOrg(accessToken, orgName): Chainable;
  }
}
