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

    /**
     * Get organization API call.
     *
     * @example
     *   cy.apiGetOrg(userAccessToken).then((org) => {
     *      cy.apiInviteOrgMember(accessToken, orgId, member);
     * });
     * @param accessToken
     */
    apiGetOrg(accessToken): Chainable;

    /**
     * Delete organization API call.
     *
     * @example
     *   cy.apiDeleteOrg(userAccessToken);
     * @param orgId
     * @param accessToken
     */
    apiDeleteOrg(orgId, accessToken): Chainable;
    /**
     * Invites user to the org API call.
     *
     * @example
     *   cy.apiInviteOrgMember(accessToken, orgId, member);
     * @param accessToken
     * @param orgId
     * @param member
     */
    apiInviteOrgMember(accessToken, orgId, member): Chainable;
  }
}
